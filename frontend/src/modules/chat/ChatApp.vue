<template>
	<div id="app">
		<h2>Work in progress</h2>
		<button v-on:click="sendMessage('hello')">Send< </button>
	</div>
</template>

<script setup>

export default {
	name: 'App',
    data: function() {
      return {
		connection: null
	  }
    },
	methods: {
		sendMessage: function(message) {
			console.log("Hello")
			console.log(this.connection);
			this.connection.send(message);
		}
	},
	created: function() {
		console.log("Init connection to WebSocket")
		this.connection = new WebSocket("wss://echo.websocket.org")

		this.connection.onopen = function(event) {
			console.log(event)
			console.log("Success")
		}

		this.connection.onmessage = function(event) {
			console.log(event);
		}

	}
}

</script>

<style>
@import '../../style.css';


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  @apply bg-bg-main pt-20
}
</style>