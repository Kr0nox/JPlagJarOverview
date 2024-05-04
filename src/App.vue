<template>
  <div
    class="h-screen w-screen flex flex-col min-h-screen overflow-hidden bg-zinc-950 text-white p-5 pb-2"
  >
    <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] mb-4 gap-3">
      <h1 class="text-3xl col-start-1 row-start-1">
        JPlag Jar Download Overview
      </h1>
      <input
        class="col-start-2 row-start-1 rounded-md bg-zinc-800 border-zinc-950 text-white px-1 outline-none"
        v-model="apiToken"
        placeholder="GitHub API Token (only used for getting jars)"
      />
      <p class="col-span-2 col-start-1 row-start-2">
        Just click on an entry and it will download the jar. This can take a few
        seconds, due to the GitHub API.
      </p>
    </div>

    <div class="flex flex-1 overflow-hidden gap-3">
      <Panel
        class="flex-1 max-h-full"
        name="Releases"
        :always-shown-options="[newestRelease]"
        :options="releases"
        more-name="Older Releases"
      />
      <Panel
        class="flex-1 max-h-full"
        name="Open Pull Requests"
        :always-shown-options="prs"
        :options="dependenciesPrs"
        more-name="Dependencies"
      />
      <Panel
        class="flex-1 max-h-full"
        name="Branches"
        :always-shown-options="mainDevBranch"
        :options="branches"
      />
    </div>
    <div class="text-xs mt-2">
      This page is not affiliated with
      <a class="underline text-blue-400" href="github.com/jplag/Jplag">JPlag</a
      >. It is a privatly maintained page to provide easy access to the latest
      JPlag jars in the development process. All data gets extracted using the
      <a class="underline text-blue-400" href="https://docs.github.com/en/rest"
        >GitHub Rest API</a
      >.
    </div>
  </div>
  <div
    v-if="showLoadingScreen"
    class="z-50 h-screen w-screen absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-70 text-3xl text-black flex text-center items-center justify-center align-middle"
  >
    <div class="h-fit w-fit">
      <div
        class="mx-auto h-16 w-16 animate-spin rounded-full border-8 border-gray-500 border-t-black"
      ></div>
      Providing Jar...
    </div>
  </div>
</template>

<script setup lang="ts">
import Panel from "./components/Panel.vue";
import {
  BranchJarPlace,
  DummyJarPlace,
  JarPlace,
  PullRequestJarPlace,
  ReleaseJarPlace,
} from "./model/internal";

import { provide, Ref, ref } from "vue";
import {
  getAllBranches,
  getAllPrs,
  getAllReleases,
} from "./model/apiInterface";
import { Release } from "./model/apiModel";

const apiToken = ref("");
provide("apiToken", apiToken);

const newestRelease: Ref<JarPlace> = ref(
  new DummyJarPlace("No Token provided yet")
);
const releases: Ref<JarPlace[]> = ref([]);

const prs: Ref<JarPlace[]> = ref([new DummyJarPlace("No Token provided yet")]);
const dependenciesPrs: Ref<JarPlace[]> = ref([]);

const mainDevBranch: Ref<JarPlace[]> = ref([
  new DummyJarPlace("No Token provided yet"),
]);
const branches: Ref<JarPlace[]> = ref([]);

getAllReleases().then((data) => {
  newestRelease.value = new ReleaseJarPlace(data[0]);
  releases.value = data.map((release: Release) => new ReleaseJarPlace(release));
});
getAllPrs().then((data) => {
  prs.value = data
    .filter((pr) => !pr.title.includes("Dependency"))
    .map((pr) => new PullRequestJarPlace(pr));
  dependenciesPrs.value = data
    .filter((pr) => pr.title.includes("Dependency"))
    .map((pr) => new PullRequestJarPlace(pr));
});
getAllBranches().then((data) => {
  mainDevBranch.value = data
    .filter((branch) => branch.name === "main" || branch.name === "develop")
    .sort((a, _) => (a.name == "main" ? -1 : 1))
    .map((branch) => new BranchJarPlace(branch));
  branches.value = data
    .filter(
      (branch) =>
        !["main", "develop", "legacy", "gh-pages"].includes(branch.name) &&
        !branch.name.startsWith("dependabot")
    )
    .map((branch) => new BranchJarPlace(branch));
});

const showLoadingScreen = ref(false);
provide("showLoadingScreen", showLoadingScreen);
</script>
