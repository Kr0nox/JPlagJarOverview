<template>
  <div class="flex cursor-pointer items-center" @click="download()"><span class="flex-1">{{ jarPlace.getJarName() }}</span><img class="h-5 invert" src="../assets/download-solid.svg" alt="Download"></div>
</template>

<script setup lang="ts">
import { inject, PropType, Ref } from 'vue';
import { JarPlace } from '../model/internal';



const props = defineProps({
  jarPlace: {
    type: Object as PropType<JarPlace>,
    required: true
  }
})

const showLoadingScreen = inject('showLoadingScreen') as Ref<boolean>

async function download() {
  if (apiToken.value === "") {
    alert("Please provide an API Token first");
    return;
  }
  showLoadingScreen.value = true;
 //creating an invisible element
 try {
  var element = document.createElement('a');
  element.setAttribute('href', await props.jarPlace.getJarDownloadLink(apiToken.value));
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

const apiToken = inject('apiToken') as Ref<string>
</script>