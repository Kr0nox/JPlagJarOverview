<template>
  <div class="rounded-md flex flex-col bg-zinc-800 overflow-hidden py-1 px-2">
    <h1 class="text-xl" v-if="alwaysShownOptions.length > 0">{{ name }}</h1>
    <div class="overflow-scroll flex-1 space-y-3 mt-2">
      <Option
        class="ml-2"
        v-for="j in alwaysShownOptions"
        :key="j.getJarName()"
        :jar-place="j"
      />
      <div v-if="options.length > 0" class="mt-8">
        <div
          class="flex cursor-pointer"
          :class="alwaysShownOptions.length > 0 ? 'text-lg mt-2' : 'text-xl'"
          @click="changeExpanded()"
        >
          <span class="flex-1">{{
            alwaysShownOptions.length > 0 ? moreName : name
          }}</span>
          <span>{{ expanded ? "&#9650;" : "&#9660;" }}</span>
        </div>
        <div v-if="expanded" class="space-y-3 mt-2">
          <Option
            class="ml-2"
            v-for="j in options"
            :key="j.getJarName()"
            :jar-place="j"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { JarPlace } from "../model/internal";
import Option from "./Option.vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
  alwaysShownOptions: {
    type: Array<JarPlace>,
    required: false,
    default: [],
  },
  options: {
    type: Array<JarPlace>,
    required: true,
  },
  moreName: {
    type: String,
    required: false,
    default: "More",
  },
});

const expanded = ref(false);

function changeExpanded() {
  expanded.value = !expanded.value;
}
</script>
