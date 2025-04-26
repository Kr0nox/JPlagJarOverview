<template>
  <div class="flex cursor-pointer items-center" @click="download()"><span class="flex-1">{{ jarPlace.getJarName() }}</span><img class="h-5 invert" src="../assets/download-solid.svg" alt="Download"></div>
</template>

<script setup lang="ts">
import { inject, PropType, Ref } from 'vue';
import { JarPlace } from '../model/internal';
import key from '../keyMath/key.json'
// @ts-ignore
import { decrypt } from '../keyMath/crypt.js';



const props = defineProps({
  jarPlace: {
    type: Object as PropType<JarPlace>,
    required: true
  }
})

const showLoadingScreen = inject('showLoadingScreen') as Ref<boolean>

async function download() {
  showLoadingScreen.value = true;
 //creating an invisible element
 try {
  var element = document.createElement('a');
  element.setAttribute('href', await props.jarPlace.getJarDownloadLink(decrypt(key.encrypted_key)));
  element.setAttribute('download', getFileName());
  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
 } catch (e) {
    console.error(e)
   alert('Error downloading file\n'+ (e as Error))
 }
  showLoadingScreen.value = false;
}

// TODO: Add time to name
function getFileName() {
  return props.jarPlace.getJarName().replace(/[/ ]/g, '_') + ".jar"
}
</script>