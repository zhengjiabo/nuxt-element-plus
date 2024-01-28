<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
const open = () => {
  ElMessageBox.alert('This is a message', 'Title', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      })
    },
  })
}

const apiClick = async () => {
  const { data } = await useFetch('/api/hello')
  console.log(data.value?.text)
}
</script>

<template>
  <div>
    <Demo />
    <span @click="open">wel</span>
    <div @click="apiClick">api</div>
  </div>
</template>

<style lang="scss">
/*  */
</style>
