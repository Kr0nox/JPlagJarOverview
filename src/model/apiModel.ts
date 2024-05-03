export interface Branch {
  name: string
  commit: {
    sha: string
    url: string
  }
}

export interface PullRequest {
  number: number
  title: string
  head: {sha: string}
}

export interface Release {
  name?: string
  tag_name?: string
  assets: Assest[]
}

interface Assest {
  content_type: string
  browser_download_url: string
}

export interface WorkflowRun {
  id: number
  name: string
  artifacts_url: string
  status: string
  conclusion: string
}

export interface Artifact {
  id: number
  name: string
  archive_download_url: string
  created_at: string
  expires_at: string
}