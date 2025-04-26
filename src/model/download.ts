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

function getFileName(jar: JarPlace) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const dateString = `${year}${padNumber(month)}${padNumber(day)}${padNumber(hours)}${padNumber(minutes)}`
    return jar.getJarName().replace(/[/ ]/g, '_') + "-" + dateString + ".jar"
}

function padNumber(num: number) {
    return num.toString().padStart(2, "0")
}
