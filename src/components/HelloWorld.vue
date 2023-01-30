<script setup lang="ts">
import { Notify } from 'quasar'
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)

function notifyUser() {
  Notify.create({
    message: 'Danger, Will Robinson! Danger!'
  })
}
</script>

<template>
  <h1 class="my-text-3xl my-font-bold my-underline">{{ msg }}</h1>

  <div class="card">

    <q-btn color="secondary q-mr-sm" @click="count++" glossy text-color="white" push icon="verified_user">
      count is {{ count }}
    </q-btn>
    <q-btn @click="notifyUser" glossy text-color="primary" push icon="verified_user">
      Notify user
    </q-btn>

    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
