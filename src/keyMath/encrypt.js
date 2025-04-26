import { writeFile } from 'fs'
import { encrypt } from './crypt.js'

async function run() {
  const key = process.argv[process.argv.length - 1]
  const result = { encrypted_key: encrypt(key) }
  writeFile('src/keyMath/key.json', JSON.stringify(result), () => {})
}

run()