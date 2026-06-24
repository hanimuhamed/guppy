import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const source = path.join(root, 'node_modules', 'pyodide')
const target = path.join(root, 'public', 'pyodide')

await mkdir(target, { recursive: true })
await cp(source, target, { recursive: true })

console.log('Copied Pyodide assets to public/pyodide')
