<template>
  <div class="flex gap-x-5 items-center">
    <button class="flex cursor-pointer items-center flex-1 gap-x-1" @click="download()">
      <span class="flex-1 text-left">{{ jarPlace.getJarName() }}</span>
      <img class="h-5 invert" src="../assets/download-solid.svg" alt="Download">
    </button>

    <button class="cursor-pointer flex items-center active:scale-75 duration-200" @click="copyLink()">
      <img class="h-5" src="../assets/link-solid.svg" alt="Copy link">
    </button>
  </div>
</template>

<script setup lang="ts">
import { inject, PropType, Ref } from 'vue';
import { JarPlace } from '../model/internal';
import { downloadJar } from '../model/download.js';



const props = defineProps({
  jarPlace: {
    type: Object as PropType<JarPlace>,
    required: true
  }
})

const showLoadingScreen = inject('showLoadingScreen') as Ref<boolean>

async function download() {
  showLoadingScreen.value = true;
  await downloadJar(props.jarPlace)
  showLoadingScreen.value = false;
}

function copyLink() {
  navigator.clipboard.writeText(window.location + "?dl=" + props.jarPlace.getQueryValue())
}
</script>