<script setup>
	import { ref, onMounted } from 'vue';

	const width = 1000;
	const height = 600;
	const canvasRef = ref(null);
	const vueCanvas = ref(null);
	const isDrawing = ref(false);
	const coord = ref({x: 0, y: 0});
	const penColor = ref('#000000');

	onMounted(() => {
		vueCanvas.value = canvasRef.value.getContext("2d");
	});

	const reposition = (event) => {
		coord.value.x = event.offsetX;
		coord.value.y = event.offsetY;
	};
	
	const start = (event) => {
		isDrawing.value = true;
		reposition(event);
	};

	const stop = () => {
		isDrawing.value = false;
	};

	const clear = () => {
		vueCanvas.value.clearRect(0, 0, 1000, 600);
	};

	const draw = (event) => {
		if (!isDrawing.value) return;

		const ctx = vueCanvas.value;

		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		ctx.strokeStyle = penColor.value;

		ctx.moveTo(coord.value.x, coord.value.y);
		reposition(event);
		ctx.lineTo(coord.value.x, coord.value.y);
		ctx.stroke();
	};

	const penColorBlue = () => {
		penColor = '#0000FF';
	};
</script>

<template>
	<div class="flex justify-center">
		<canvas ref="canvasRef" :width="width" :height="height"
			class="border-4 border-solid border-red-500 bg-white"
			@mousedown="start"
			@mousemove="draw"
			@mouseup="stop"
			@mouseleave="stop"
			></canvas>
	</div>
	<div class="flex flex-grid justify-center">
		<button class="text-white bg-gray-500" @click="clear">Clear</button>
		<button class="text-white bg-black" @click="penColor = 'black'">BLACK</button>
		<button class="text-white bg-gray-500" @click="penColor = 'gray'">GRAY</button>
		<button class="text-white bg-blue-500" @click="penColor = 'blue'">BLUE</button>
		<button class="text-white bg-red-500" @click="penColor = 'red'">RED</button>
		<button class="text-white bg-green-500" @click="penColor = 'green'">GREEN</button>
		<button class="text-white bg-yellow-500" @click="penColor = 'yellow'">YELLOW</button>
		<button class="text-white bg-purple-500" @click="penColor = 'purple'">VIOLET</button>
		<button class="text-white bg-yellow-900" @click="penColor = 'brown'">BROWN</button>
		<button class="text-white bg-pink-500" @click="penColor = 'pink'">PINK</button>
	</div>
	
</template>

<style>

</style>