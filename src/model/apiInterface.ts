import { Artifact, Branch, PullRequest, Release, WorkflowRun } from "./apiModel"
import token from '../token.json'

const owner = 'jplag'
const repo = 'JPlag'
const baseUrl = `https://api.github.com/repos/${owner}/${repo}`


const auth = 'Bearer ' + token['token']

export async function getAllBranches() {
  return getJson<Branch[]>(`/branches`)
}

export async function getAllPrs() {
  return getJson<PullRequest[]>(`/pulls?state=open`)
}

export async function getAllReleases() {
  return getJson<Release[]>(`/releases`)
}

export async function getWorkflowRuns(sha: string) {
  const runs: WorkflowRun[] = []
  let page = 1
  let count = 0
  do {
    const r = await getJson<{total_count:number, workflow_runs: WorkflowRun[]}>(`/actions/runs?head_sha=${sha}&page=${page}`)
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
    const r = await getJson<{total_count:number, artifacts: Artifact[]}>(`/actions/runs/${id}/artifacts?page=${page}`)
    artifacts.push(...r.artifacts)
    count = r.total_count
  } while (artifacts.length < count)
  return artifacts
}

export async function fetchArtifactZip(artifact: Artifact) {
  return fetch(artifact.archive_download_url, {headers: {'Authorization': auth}}).then(res => res.blob())
}

async function getJson<T>(url:string): Promise<T> {
  console.log(auth)
  return fetch(baseUrl + url, {headers: {'Authorization': auth}}).then(res => res.json() as T)
}
