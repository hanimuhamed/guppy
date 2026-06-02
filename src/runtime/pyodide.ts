import { loadPyodide, type PyodideInterface } from 'pyodide'

let pyodidePromise: Promise<PyodideInterface> | null = null

export const getPyodide = () => {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide({ indexURL: '/pyodide/' })
  }
  return pyodidePromise
}
