<template>
  <img alt="Vue logo1" src="@/assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
  {{xxx}}
  <button @click="onclick">onclick</button>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'

const xxx = ref(1111)

const onclick = () => {
  xxx.value = 2222
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
