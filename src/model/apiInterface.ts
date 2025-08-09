import { Artifact, Branch, PullRequest, Release, WorkflowRun } from "./apiModel"
import keyjson from '../keyMath/key.json'
// @ts-ignore
import { decrypt } from '../keyMath/crypt.js';
const owner = 'jplag'
const repo = 'JPlag'
const baseUrl = `https://api.github.com/repos/${owner}/${repo}`

const key = decrypt(keyjson.encrypted_key)

export async function getAllBranches() {
  return getJson<Branch[]>(`/branches`, key)
}

export async function getBranch(branchName: string) {
  return getJson<Branch>(`/branches/${branchName}`, key)
}

export async function getAllPrs() {
  return getJson<PullRequest[]>(`/pulls?state=open`, key)
}

export async function getPr(prNumber: number) {
  return getJson<PullRequest>(`/pulls/${prNumber}`, key)
}

export async function getAllReleases() {
  return getJson<Release[]>(`/releases`, key)
}

export async function getRelease(tag: string) {
  return getJson<Release>(`/releases/tags/${tag}`, key)
}

export async function getWorkflowRuns(sha: string) {
  const runs: WorkflowRun[] = []
  let page = 1
  let count = 0
  do {
    const r = await getJson<{total_count:number, workflow_runs: WorkflowRun[]}>(`/actions/runs?head_sha=${sha}&page=${page}`, key)
    runs.push(...r.workflow_runs)
    count = r.total_count
  } while (runs.length < count)

  return runs
}

export async function getArtifacts(id: number) {
  const artifacts: Artifact[] = []
  let page = 1
  let count = 0
  do {
    const r = await getJson<{total_count:number, artifacts: Artifact[]}>(`/actions/runs/${id}/artifacts?page=${page}`, key)
    artifacts.push(...r.artifacts)
    count = r.total_count
  } while (artifacts.length < count)
  return artifacts
}

export async function fetchArtifactZip(artifact: Artifact, apiToken: string) {
  return fetch(artifact.archive_download_url, {headers: {'Authorization': `Bearer ${apiToken}`}}).then(res => res.blob())
}

async function getJson<T>(url:string, apiToken?: string): Promise<T> {
  const options = apiToken ? {headers: {'Authorization': `Bearer ${apiToken}`}} : {}
  return fetch(baseUrl + url, options).then(res => res.json() as T)
}
