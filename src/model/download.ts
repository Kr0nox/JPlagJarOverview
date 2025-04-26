import { JarPlace } from "./internal";
import key from '../keyMath/key.json'
// @ts-ignore
import { decrypt } from '../keyMath/crypt.js';

export async function downloadJar(jar: JarPlace) {
    //creating an invisible element
    try {
     var element = document.createElement('a');
     element.setAttribute('href', await jar.getJarDownloadLink(decrypt(key.encrypted_key)));
     element.setAttribute('download', getFileName(jar));
     document.body.appendChild(element);
     element.click();
   
     document.body.removeChild(element);
    } catch (e) {
       console.error(e)
      alert('Error downloading file\n'+ (e as Error))
    }
}

// TODO: Add time to name
function getFileName(jar: JarPlace) {
    return jar.getJarName().replace(/[/ ]/g, '_') + ".jar"
  }

