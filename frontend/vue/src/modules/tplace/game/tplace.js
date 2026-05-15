import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import selectImageUrl from './select.png'

const X_MAX = 56
const Y_MAX = 38
const CELL_SIZE = 16

export function runTplace() {
const colors = [
	{ name: 'Black', value: '#000000' },
	{ name: 'Red', value: '#FF1A1A' },
	{ name: 'Orange', value: '#FF9900' },
	{ name: 'Yellow', value: '#FFFF00' },
	{ name: 'Lime', value: '#CCFF00' },
	{ name: 'Green', value: '#33FF00' },
	{ name: 'Dark Gray', value: '#5A5A5A' },
	{ name: 'Dark Red', value: '#990000' },
	{ name: 'Brown', value: '#804000' },
	{ name: 'Olive', value: '#667700' },
	{ name: 'Dark Green', value: '#1A7F00' },
	{ name: 'Forest', value: '#007F33' },
	{ name: 'Gray', value: '#A0A0A0' },
	{ name: 'Cyan', value: '#1AD4D4' },
	{ name: 'Blue', value: '#1A66FF' },
	{ name: 'Indigo', value: '#4B00FF' },
	{ name: 'Magenta', value: '#CC00FF' },
	{ name: 'Pink', value: '#FF0080' },
	{ name: 'White', value: '#FFFFFF' },
	{ name: 'Teal', value: '#0F7F7A' },
	{ name: 'Navy', value: '#0D3B7F' },
	{ name: 'Deep Blue', value: '#2A0A7F' },
	{ name: 'Purple', value: '#7A0A7F' },
	{ name: 'Dark Pink', value: '#99004D' },
]

const canvasRef = ref(null)
const showGrid = ref(false)
const selectedColor = ref(colors[0].value)
const pointerStatus = ref('Mouse not here :(')
const gridLabel = computed(() => (showGrid.value ? 'Grille affichee' : 'Grille cachee'))
const pixelsLeft = ref('Pixels restants: 100/100')

const pixels = Array.from({ length: Y_MAX }, () => Array.from({ length: X_MAX }, () => null))
const undoStack = []
const redoStack = []

let ctx = null
let hoverImage = null
let hoverCell = null
let currentStroke = null
let isDrawing = false
let animationFrameId = 0
let placed = 0

function selectColor(color) {
	selectedColor.value = color
}

function getCanvas() {
	if (!(canvasRef.value instanceof HTMLCanvasElement)) {
		throw new Error('Canvas not found')
	}

	return canvasRef.value
}

function getMousePos(event) {
	const canvas = getCanvas()
	const rect = canvas.getBoundingClientRect()
	const style = getComputedStyle(canvas)

	const borderLeft = parseFloat(style.borderLeftWidth)
	const borderTop = parseFloat(style.borderTopWidth)
	const borderRight = parseFloat(style.borderRightWidth)
	const borderBottom = parseFloat(style.borderBottomWidth)
	const drawableWidth = Math.max(1, rect.width - borderLeft - borderRight)
	const drawableHeight = Math.max(1, rect.height - borderTop - borderBottom)
	const scaleX = canvas.width / drawableWidth
	const scaleY = canvas.height / drawableHeight
	const mouseX = (event.clientX - rect.left - borderLeft) * scaleX
	const mouseY = (event.clientY - rect.top - borderTop) * scaleY
	const cellX = Math.max(0, Math.min(X_MAX - 1, Math.floor(mouseX / CELL_SIZE)))
	const cellY = Math.max(0, Math.min(Y_MAX - 1, Math.floor(mouseY / CELL_SIZE)))

	pointerStatus.value = `Mouse pos (x,y): ${cellX},${cellY}`

	return { cellX, cellY }
}

function drawPixel(x, y, color) {
	ctx.fillStyle = color
	ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
}

function drawPixels() {
	for (let y = 0; y < Y_MAX; y += 1) {
		for (let x = 0; x < X_MAX; x += 1) {
			drawPixel(x, y, pixels[y][x] ?? '#FFFFFF')
		}
	}
}

function drawGrid() {
	if (!showGrid.value) {
		return
	}

	const canvas = getCanvas()

	ctx.strokeStyle = '#7A6189'
	ctx.lineWidth = 1

	for (let x = 0; x <= X_MAX; x += 1) {
		ctx.beginPath()
		ctx.moveTo(x * CELL_SIZE + 0.5, 0)
		ctx.lineTo(x * CELL_SIZE + 0.5, canvas.height)
		ctx.stroke()
	}

	for (let y = 0; y <= Y_MAX; y += 1) {
		ctx.beginPath()
		ctx.moveTo(0, y * CELL_SIZE + 0.5)
		ctx.lineTo(canvas.width, y * CELL_SIZE + 0.5)
		ctx.stroke()
	}
}

function drawHover() {
	if (hoverCell === null || hoverImage === null || !hoverImage.complete) {
		return
	}

	ctx.drawImage(
		hoverImage,
		hoverCell.x * CELL_SIZE,
		hoverCell.y * CELL_SIZE,
		CELL_SIZE,
		CELL_SIZE,
	)
}

function beginStroke() {
	currentStroke = []
}

function recordPixelChange(x, y, newColor) {
	const oldColor = pixels[y][x]

	if (oldColor === newColor) {
		return
	}

	if (currentStroke === null) {
		currentStroke = []
	}

	const existingChange = currentStroke.find((change) => change.x === x && change.y === y)

	if (existingChange) {
		existingChange.newColor = newColor
	} else {
		currentStroke.push({
			x,
			y,
			oldColor,
			newColor,
		})
	}

	placed++
	pixels[y][x] = newColor
}

function commitStroke() {
	if (currentStroke === null) {
		return
	}

	if (currentStroke.length > 0) {
		undoStack.push(currentStroke)
		redoStack.length = 0
	}

	currentStroke = null
}

function applyStroke(stroke, direction) {
	stroke.forEach((change) => {
		pixels[change.y][change.x] = direction === 'undo' ? change.oldColor : change.newColor
	})
}

function undo() {
	commitStroke()

	const stroke = undoStack.pop()

	if (!stroke) {
		return
	}

	applyStroke(stroke, 'undo')
	redoStack.push(stroke)
}

function redo() {
	commitStroke()

	const stroke = redoStack.pop()

	if (!stroke) {
		return
	}

	applyStroke(stroke, 'redo')
	undoStack.push(stroke)
}

function colorize(event) {
	const pos = getMousePos(event)

	recordPixelChange(pos.cellX, pos.cellY, selectedColor.value)
}

function handleMouseMove(event) {
	const pos = getMousePos(event)

	hoverCell = {
		x: pos.cellX,
		y: pos.cellY,
	}

	if (isDrawing) {
		colorize(event)
	}
}

function handleMouseLeave() {
	pointerStatus.value = 'Mouse not here :('
	hoverCell = null
	isDrawing = false
	commitStroke()
}

function handleMouseDown(event) {
	if (event.button !== 0) {
		return
	}

	event.preventDefault()
	isDrawing = true
	beginStroke()

	const pos = getMousePos(event)

	hoverCell = {
		x: pos.cellX,
		y: pos.cellY,
	}

	colorize(event)
}

function handleMouseUp() {
	isDrawing = false
	commitStroke()
}

function handleKeydown(event) {
	if (!event.ctrlKey || event.key.toLowerCase() !== 'z') {
		return
	}

	event.preventDefault()

	if (event.shiftKey) {
		redo()
	} else {
		undo()
	}
}

function loop() {
	if (!ctx) {
		return
	}

	const canvas = getCanvas()

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawPixels()
	drawGrid()
	drawHover()
	pixelsLeft.value = "Pixels restants: " + (100 - placed) + "/100"

	animationFrameId = requestAnimationFrame(loop)
}

onMounted(() => {
	const canvas = getCanvas()

	canvas.width = CELL_SIZE * X_MAX
	canvas.height = CELL_SIZE * Y_MAX
	ctx = canvas.getContext('2d')

	if (!ctx) {
		throw new Error('2D context not available')
	}

	hoverImage = new Image()
	hoverImage.src = selectImageUrl

	document.addEventListener('keydown', handleKeydown)
	loop()
})

onBeforeUnmount(() => {
	document.removeEventListener('keydown', handleKeydown)
	cancelAnimationFrame(animationFrameId)
	commitStroke()
})

return {
	canvasRef,
	colors,
	gridLabel,
	handleMouseDown,
	handleMouseLeave,
	handleMouseMove,
	handleMouseUp,
	pixelsLeft,
	pointerStatus,
	redo,
	selectColor,
	selectedColor,
	showGrid,
	undo,
}
}
