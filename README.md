# [JPlag](https://github.com/jplag/JPlag) Jar Overview

This tool helps keep an overview over the current jars in the [JPlag](https://github.com/jplag/JPlag) development workflow. It keeps track of all releases, branches and open pull requests.

This tool is not affiliated with [JPlag](https://github.com/jplag/JPlag) or the [Karlsrue Institute of Technology](https://www.kit.edu). It is privatly maintained.

## How it works
The tool operates using the [GitHub Rest API](https://docs.github.com/en/rest). 
For the releases, it just redirects to the download link for the jar attached to the release.
For branches and pull requests, it fetches the workflow from the last commit and tries to find a workflow that build a jar and has it attached as an artifact. It than downloads the zip extracts it and only gives the user the artifact. This whole process can take some time, so it is a bit slower.

## Installation
This is a vue project, so you need Node.js and npm installed.
1) Clone the repository
2) run `npm install`	
3) run `npm run key -- YOUR_API_KEY`
4) run `npm run dev`

### API token
If you want to be able to access artifacts your token needs the permissions listed here: https://docs.github.com/en/rest/actions/artifacts?apiVersion=2022-11-28#download-an-artifact
