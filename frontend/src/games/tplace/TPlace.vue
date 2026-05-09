<template>
	<main class="tplace-page">
		<header class="tplace-header">
			<h1>t/place</h1>
			<p>Zone d'experimentation JS pour le futur t/place.</p>
		</header>

		<section class="tplace-layout">
			<aside class="tplace-panel">
				<button class="tplace-side-button" type="button">A useless button</button>

				<p class="hint">
					Clique et deplace la souris dans le canvas.
				</p>
			</aside>

			<section class="canvas-shell">
				<div class="canvas-toolbar">
					<button class="pretty-button" type="button">
						Paint
						<span
							v-for="star in 6"
							:key="star"
							:class="['star', `star-${star}`]"
							aria-hidden="true"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								xml:space="preserve"
								version="1.1"
								viewBox="0 0 784.11 815.53"
							>
								<path
									class="fil0"
									d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
								/>
							</svg>
						</span>
					</button>

					<div class="history-controls" aria-label="History controls">
						<button class="history-button" type="button" title="Undo" aria-label="Undo" @click="undo">
							&lt;
						</button>
						<button class="history-button" type="button" title="Redo" aria-label="Redo" @click="redo">
							&gt;
						</button>
					</div>

					<div class="color-palette" aria-label="Color palette">
						<button
							v-for="color in colors"
							:key="color.value"
							class="color-swatch"
							:class="{ 'is-selected': selectedColor === color.value }"
							type="button"
							:style="{ '--swatch-color': color.value }"
							:title="color.name"
							:aria-label="color.name"
							@click="selectColor(color.value)"
						/>
					</div>

					<label class="grid-toggle">
						<input v-model="showGrid" type="checkbox">
						<span class="checkmark"></span>
						<span>{{ gridLabel }}</span>
					</label>
				</div>

				<p class="pointer-status">{{ pointerStatus }}</p>
				<canvas
					ref="canvasRef"
					class="tplace-canvas"
					width="896"
					height="608"
					@mousemove="handleMouseMove"
					@mouseleave="handleMouseLeave"
					@mousedown="handleMouseDown"
					@mouseup="handleMouseUp"
				/>
			</section>
		</section>
	</main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import selectImageUrl from './select.png'

const X_MAX = 56
const Y_MAX = 38
const CELL_SIZE = 16

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

const pixels = Array.from({ length: Y_MAX }, () => Array.from({ length: X_MAX }, () => null))
const undoStack = []
const redoStack = []

let ctx = null
let hoverImage = null
let hoverCell = null
let currentStroke = null
let isDrawing = false
let animationFrameId = 0

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
</script>

<style scoped>
:global(body) {
	margin: 0;
}

.tplace-page,
.tplace-page * {
	box-sizing: border-box;
}

.tplace-page {
	min-height: 100vh;
	padding: 32px;
	background: #383c74;
	color: #F8F4F9;
	font-family: system-ui, sans-serif;
}

.tplace-header {
	margin-bottom: 24px;
}

.tplace-header h1 {
	margin: 0 0 8px;
}

.tplace-header p {
	margin: 0;
	color: #BDABC8;
}

.tplace-layout {
	display: grid;
	grid-template-columns: 240px 1fr;
	gap: 24px;
	align-items: start;
}

.tplace-panel {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 16px;
	border: 1px solid #7A6189;
	border-radius: 8px;
	background: #7e608b;
}

.tplace-side-button {
	padding: 10px 12px;
	border: 0;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 700;
}

.hint {
	color: #FFFFFF;
	font-size: 14px;
	line-height: 1.4;
}

.canvas-shell {
	display: grid;
	grid-template-columns: minmax(0, 896px) max-content;
	gap: 16px;
	align-items: start;
	overflow: auto;
	padding: 16px;
	border: 1px solid #7A6189;
	border-radius: 8px;
	background: #484B75;
}

.canvas-toolbar {
	display: flex;
	flex-direction: column;
	grid-column: 2;
	grid-row: 2;
	align-items: stretch;
	gap: 12px;
}

.tplace-canvas {
	display: block;
	grid-column: 1;
	grid-row: 2;
	width: 100%;
	max-width: 896px;
	height: auto;
	border: 8px solid #7A6189;
	border-radius: 8px;
	background: #F8F4F9;
	cursor: crosshair;
}

.pointer-status {
	grid-column: 1;
	grid-row: 1;
	margin: 0;
}

.color-palette {
	display: grid;
	grid-template-columns: repeat(6, 20px);
	gap: 6px;
	padding: 8px;
	border: 1px solid #f0abfc;
	border-radius: 8px;
	background: #383c74;
	box-shadow: 0 0 18px #e879f933;
}

.color-swatch {
	width: 20px;
	height: 20px;
	padding: 0;
	border: 2px solid #F8F4F9;
	border-radius: 4px;
	background: var(--swatch-color);
	box-shadow: 0 0 0 1px #00000066;
	cursor: pointer;
}

.color-swatch:hover,
.color-swatch.is-selected {
	border-color: #f0abfc;
	box-shadow: 0 0 0 2px #c026d3, 0 0 12px #e879f9cc;
}

.history-controls {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 8px;
}

.history-button {
	height: 34px;
	padding: 0;
	border: 2px solid #f0abfc;
	border-radius: 8px;
	background: #383c74;
	color: #F8F4F9;
	box-shadow: 0 0 0 #e879f98c;
	cursor: pointer;
	font-size: 18px;
	font-weight: 700;
	transition: all 0.2s ease-in-out;
}

.history-button:hover {
	background: #701a75;
	box-shadow: 0 0 14px #e879f9aa;
}

.grid-toggle input {
	position: absolute;
	width: 0;
	height: 0;
	border-radius: 5px;
	opacity: 0;
	cursor: pointer;
}

.grid-toggle {
	display: inline-flex;
	position: relative;
	align-items: center;
	gap: 8px;
	border-radius: 5px;
	cursor: pointer;
	font-size: 20px;
	user-select: none;
}

.checkmark {
	display: block;
	position: relative;
	width: 1.3em;
	height: 1.3em;
	flex-shrink: 0;
	border-radius: 5px;
	background-color: #f0abfc;
	box-shadow: 1px 1px 0 #c026d3;
	opacity: 1;
	transition: all 0.2s;
}

.grid-toggle input:checked ~ .checkmark {
	background-image: linear-gradient(135deg, #f0abfc 0%, #c026d3 48%, #7e22ce 100%);
	box-shadow: 3px 3px 0 #e879f9cc;
}

.checkmark::after {
	content: "";
	position: absolute;
	left: 0.45em;
	top: 0.25em;
	width: 0.25em;
	height: 0.5em;
	border: solid #F8F4F9;
	border-width: 0 0.15em 0.15em 0;
	opacity: 0;
	transform: rotate(45deg);
	transition: all 0.2s;
}

.grid-toggle input:checked ~ .checkmark::after {
	opacity: 1;
}

.pretty-button {
	position: relative;
	width: 100%;
	padding: 12px 35px;
	border: 3px solid #f0abfc;
	border-radius: 8px;
	background: linear-gradient(135deg, #f0abfc 0%, #c026d3 48%, #7e22ce 100%);
	box-shadow: 0 0 0 #e879f98c;
	color: #F8F4F9;
	cursor: pointer;
	font-size: 17px;
	font-weight: 500;
	transition: all 0.3s ease-in-out;
}

.star {
	position: absolute;
	height: auto;
	filter: drop-shadow(0 0 0 #F8F4F9);
	z-index: -5;
}

.star svg {
	display: block;
	width: 100%;
	height: auto;
}

.star-1 {
	top: 20%;
	left: 20%;
	width: 25px;
	transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
}

.star-2 {
	top: 45%;
	left: 45%;
	width: 15px;
	transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
}

.star-3 {
	top: 40%;
	left: 40%;
	width: 5px;
	transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
}

.star-4 {
	top: 20%;
	left: 40%;
	width: 8px;
	transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01);
}

.star-5 {
	top: 25%;
	left: 45%;
	width: 15px;
	transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01);
}

.star-6 {
	top: 5%;
	left: 50%;
	width: 5px;
	transition: all 0.8s ease;
}

.pretty-button:hover {
	background: #701a75;
	box-shadow: 0 0 25px #e879f9cc;
	color: #F8F4F9;
}

.pretty-button:hover .star {
	filter: drop-shadow(0 0 10px #F8F4F9);
	z-index: 2;
}

.pretty-button:hover .star-1 {
	top: -80%;
	left: -30%;
}

.pretty-button:hover .star-2 {
	top: -25%;
	left: 10%;
}

.pretty-button:hover .star-3 {
	top: 55%;
	left: 25%;
}

.pretty-button:hover .star-4 {
	top: 30%;
	left: 80%;
}

.pretty-button:hover .star-5 {
	top: 25%;
	left: 115%;
}

.pretty-button:hover .star-6 {
	top: 5%;
	left: 60%;
}

.pretty-button .fil0 {
	fill: #F8F4F9;
}

@media (max-width: 900px) {
	.tplace-page {
		padding: 16px;
	}

	.tplace-layout {
		grid-template-columns: 1fr;
	}

	.canvas-shell {
		grid-template-columns: 1fr;
	}

	.canvas-toolbar {
		grid-column: 1;
		grid-row: 3;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.pretty-button {
		width: auto;
	}

	.color-palette {
		grid-template-columns: repeat(8, 20px);
	}
}
</style>
