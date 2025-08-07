import { fetchArtifactZip, getArtifacts, getWorkflowRuns } from "./apiInterface";
import { Branch, PullRequest, Release } from "./apiModel";
import { extractJarFromZip } from "./zipHandling";

export abstract class JarPlace {
  abstract getJarName(): string;

  abstract getJarDownloadLink(apiToken: string): Promise<string>;

  abstract getQueryValue(): string
}

export class ReleaseJarPlace extends JarPlace {
  constructor(private release: Release) {
    super();
  }

  getJarName(): string {
    return this.release.name ?? this.release.tag_name ?? "Unknown";
  }

  async getJarDownloadLink(_: string): Promise<string> {
    for (const asset of this.release.assets) {
      if (
        asset.content_type === "application/java-archive" ||
        asset.content_type === "application/octet-stream"
      ) {
        return asset.browser_download_url;
      }
    }
    throw "No jar found in release assets";
  }

  getQueryValue(): string {
    return this.release.tag_name ?? this.release.name ?? "Unknown";
  }
}

abstract class ArtifactJarPlace extends JarPlace {
  abstract getSha(): string;

  async getJarDownloadLink(apiToken: string): Promise<string> {
    const workflow_runs = await getWorkflowRuns(this.getSha());
    for (const run of workflow_runs) {
      if (run.name == "Complete e2e Test") {
        const artifacts = await getArtifacts(run.id);
        for (const artifact of artifacts) {
          if (artifact.name == "JPlag") {
            return this.buildDownloadLink(await fetchArtifactZip(artifact, apiToken))
          }
        }
      }
      if (run.name == "Build") {
        const artifacts = await getArtifacts(run.id);
        for (const artifact of artifacts) {
          if (artifact.name == "JPlag Jar") {
            return this.buildDownloadLink(await fetchArtifactZip(artifact, apiToken))
          }
        }
      }
    }
    throw "Could not find workflow run with jar artifact. Either no workflow was run, the workflow failed/was not finished or the artifact expired.";
  }

  async buildDownloadLink(zip: Blob) {
    const jar = await extractJarFromZip(zip)
    return window.URL.createObjectURL(jar)
  }
}

export class PullRequestJarPlace extends ArtifactJarPlace {

  constructor(private pr: PullRequest) {
    super();
  }

  getSha(): string {
    return this.pr.head.sha;
  }
  getJarName(): string {
    return `#${this.pr.number} ${this.pr.title}`
  }

  getQueryValue(): string {
    return `%23${this.pr.number}`
  }

}

export class BranchJarPlace extends ArtifactJarPlace {

  constructor(private branch: Branch) {
    super()
  }

  getSha(): string {
    return this.branch.commit.sha;
  }
  getJarName(): string {
    return this.branch.name;
  }

  getQueryValue(): string {
    return this.branch.name;
  }
}

export class DummyJarPlace extends JarPlace {
  constructor(private jarName: string) {
    super();
  }

  getJarName(): string {
    return this.jarName;
  }

  async getJarDownloadLink(): Promise<string> {
    return "";
  }

  getQueryValue(): string {
    return "unknown";
  }
}
