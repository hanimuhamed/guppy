import { Suspense, lazy, useEffect } from 'react'
import type * as monaco from 'monaco-editor'
// import nordTheme from '../themes/Nord.json'
// import draculaTheme from '../themes/Dracula.json'
import bixTheme from '../themes/Bix.json'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

let themeLoaded = false

type EditorPanelProps = {
  code: string
  onChange: (value: string) => void
  isRunning: boolean
  status: 'idle' | 'running' | 'passed' | 'failed' | 'error'
  message: string
  modelPath: string
  errorMessage: string | null
  onReset: () => void
  onRun: () => void
  fontSize: number
}

const EditorPanel = ({
  code,
  onChange,
  isRunning,
  status,
  message,
  modelPath,
  errorMessage,
  onReset,
  onRun,
  fontSize,
}: EditorPanelProps) => {

  return (
    <div className="panel editor-panel">
      <div className="panel-header">
        <span>Editor</span>
        <div className="panel-actions">   
          {isRunning ? <span className="pill">Running...</span> : null}
          <button
            type="button"
            className="icon-button icon-button--run"
            onClick={onRun}
            disabled={isRunning}
            aria-label="Run code"
            title="Run (Ctrl+Enter)"
          >
            {/* Play triangle */}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polygon
                points="5,3 21,12 5,21"
                fill="currentColor"
              />
            </svg>
            <span>RUN</span>
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onReset}
            disabled={isRunning}
            aria-label="Reset code"
            title="Reset to starter code"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 12a9 9 0 1 0 3-6.7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 3v4h5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <hr/>
      <div className="editor-body">
        {/* !editorReady ? fallback : null */}
        <Suspense fallback={null}>
          <MonacoEditor
            height="100%"
            defaultLanguage="python"
            theme="bix"
            path={`${modelPath}.py`}
            value={code}
            onChange={(value) => onChange(value ?? '')}
            beforeMount={(monacoInstance: typeof monaco) => {
              if (themeLoaded) {
                return
              }
              monacoInstance.editor.defineTheme('bix', bixTheme as monaco.editor.IStandaloneThemeData)
              themeLoaded = true
            }}
            //onMount={() => setEditorReady(true)}
            options={{
              fontSize: fontSize,
              fontFamily: "Space Mono",
              minimap: { enabled: true },
              scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
              wordWrap: 'on',
              mouseWheelZoom: true,
            }}
          />
        </Suspense>
      </div>
      
      {status !== 'idle' || errorMessage ? (
        <div className={`editor-status editor-status--${status}`}>
          <div>{errorMessage ?? message}</div>
        </div>
      ) : null}
    </div>
  )
}

export default EditorPanel
