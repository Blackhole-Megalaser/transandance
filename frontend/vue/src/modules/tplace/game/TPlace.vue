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

					<p class="pixel-count">{{ pixelsLeft }}</p>
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
import { runTplace } from './tplace.js'

const {
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
} = runTplace()
</script>

<style scoped>
/* Le style est temporaire pour le dev */
/* Faut passer a tailwind pour le final */
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
