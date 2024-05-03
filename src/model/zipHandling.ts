import JSZip from "jszip";

export async function extractJarFromZip(file: Blob) {
  return JSZip.loadAsync(file).then(zip => {
    for (const fileName of Object.keys(zip.files)) {
      if (fileName.endsWith(".jar")) {
        return zip.files[fileName]
      }
    }
    throw "No jar file found in zip"
  }).then(file => {
    return file.async("blob")
  })
}