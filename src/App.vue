<template>
  <div
    class="h-screen w-screen flex flex-col min-h-screen overflow-hidden bg-zinc-950 text-white p-5 pb-2"
  >
    <div class="grid grid-cols-[auto_1fr] grid-rows-1 mb-4 gap-3 gap-x-10">
      <h1 class="text-3xl col-start-1 row-start-1">
        JPlag Jar Downloader
      </h1>
      <p class="col-span-1 col-start-2 row-start-1 flex items-center text-zinc-500 text-right justify-end">
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
      Developed by <a class="underline text-blue-400" href="https://github.com/Kr0nox/JPlagJarOverview">Kronox</a>.
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
  getBranch,
  getPr,
  getRelease,
} from "./model/apiInterface";
import { Release } from "./model/apiModel";
import { getPRNumber, getQueryType, getReleaseTag, QueryType } from "./model/query";
import { downloadJar } from "./model/download";

const newestRelease: Ref<JarPlace> = ref(
  new DummyJarPlace("Fetching latest release...")
);
const releases: Ref<JarPlace[]> = ref([]);

const prs: Ref<JarPlace[]> = ref([new DummyJarPlace("Fetching PRs...")]);
const dependenciesPrs: Ref<JarPlace[]> = ref([]);

const mainDevBranch: Ref<JarPlace[]> = ref([
  new DummyJarPlace("Fetching branches..."),
]);
const branches: Ref<JarPlace[]> = ref([]);


getAllReleases().then(async (data) => {
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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const directDownloadQuery = urlParams.get("dl") ?? undefined;
const queryType = directDownloadQuery != undefined ? getQueryType(directDownloadQuery) : undefined;
if (queryType !== undefined) {
  showLoadingScreen.value = true;
}
switch (queryType) {
  case QueryType.RELEASE:
    getRelease(getReleaseTag(directDownloadQuery!)).then((r) => new ReleaseJarPlace(r)).then((r) => downloadJar(r)).then(() => showLoadingScreen.value = false);
    break;
  case QueryType.PR:
    getPr(getPRNumber(directDownloadQuery!)).then((r) => new PullRequestJarPlace(r)).then((r) => downloadJar(r)).then(() => showLoadingScreen.value = false);
    break
  case QueryType.BRANCH:
    getBranch(directDownloadQuery!).then((r) => new BranchJarPlace(r)).then((r) => downloadJar(r)).then(() => showLoadingScreen.value = false);
    break;
  default:
    showLoadingScreen.value = false;
    break;
}
</script>
