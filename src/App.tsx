import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import './App.css'
import { PixelBuffer } from './engine/pixelBuffer'
import { world1Levels } from './game/world1Levels'
import { world2Levels } from './game/world2Levels'
import { world3Levels } from './game/world3Levels'
import { world4Levels } from './game/world4Levels'
import { world5Levels } from './game/world5Levels'
import { world6Levels } from './game/world6Levels'
import { world7Levels } from './game/world7Levels'
import { world8Levels } from './game/world8Levels'
import { world9Levels } from './game/world9Levels'
import { world10Levels } from './game/world10Levels'
import type { LevelDefinition } from './game/types'
import { judgeBuffers } from './judge/judge'
import { runLevelCode, warmupPyWorker } from './runtime/runner'
import { loadSaveState, saveState } from './storage/saveSystem'
import CanvasPanel from './components/CanvasPanel'
import DimensionControls from './components/DimensionControls'
import EditorPanel from './components/EditorPanel'
import LevelList from './components/LevelList'
import WorldsList from './components/WorldsList'
import HintItem from './components/HintItem'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const worlds: LevelDefinition[][] = [
  world1Levels,
  world2Levels,
  world3Levels,
  world4Levels,
  world5Levels,
  world6Levels,
  world7Levels,
  world8Levels,
  world9Levels,
  world10Levels,
]

const pickInitialLevel = (levels: LevelDefinition[], savedId: string | null) => {
  if (savedId && levels.some((level) => level.id === savedId)) {
    return savedId
  }
  return levels[0]?.id ?? ''
}

const getDefaultDimensions = (levels: LevelDefinition[], levelId: string) => {
  const level = levels.find((entry) => entry.id === levelId)
  if (!level) {
    return { width: 5, height: 5 }
  }
  const width = clamp(
    Math.round((level.minimumWidth + level.maximumWidth) / 2),
    level.minimumWidth,
    level.maximumWidth,
  )
  const height = clamp(
    Math.round((level.minimumHeight + level.maximumHeight) / 2),
    level.minimumHeight,
    level.maximumHeight,
  )
  return { width, height }
}


function App() {
  const saved = useMemo(() => loadSaveState(), [])
  const [currentWorld, setCurrentWorld] = useState(saved.currentWorld)
  const activeLevels = worlds[currentWorld - 1] ?? worlds[0]
  const [activeLevelId, setActiveLevelId] = useState(pickInitialLevel(activeLevels, saved.activeLevelId))
  const [codeByLevel, setCodeByLevel] = useState<Record<string, string>>(saved.levelCode)
  const [dimensionsByLevel, setDimensionsByLevel] = useState(saved.levelDimensions)
  const [code, setCode] = useState('')
  const [width, setWidth] = useState(5)
  const [height, setHeight] = useState(5)
  const [outputBuffer, setOutputBuffer] = useState<PixelBuffer | null>(null)
  const [status, setStatus] = useState<'idle' | 'running' | 'passed' | 'failed' | 'error'>('idle')
  const [message, setMessage] = useState('Ready.')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [codeFontSize, setCodeFontSize] = useState(14)
  const [stats, setStats] = useState<{
    mismatchCount: number
    totalPixels: number
    correctCount: number
    accuracy: number
  } | null>(null)
  const [completedLevels, setCompletedLevels] = useState(new Set(saved.completedLevels))
  const [unlockedLevels, setUnlockedLevels] = useState(new Set(activeLevels.map((level) => level.id)))
  const [leftWidth, setLeftWidth] = useState<number | null>(null)
  const [worldsListWidth, setWorldsListWidth] = useState<number | null>(null)
  const [autoRunEnabled, setAutoRunEnabled] = useState(false)

  const runIdRef = useRef(0)
  const codeRef = useRef(code)
  const lastSavedRef = useRef('')
  const saveTimeoutRef = useRef<number | null>(null)
  const idleCallbackRef = useRef<number | null>(null)
  const splitRef = useRef<HTMLDivElement | null>(null)

  const appName = 'guppy'
  const appLogo = (
    <h1><span className='color-primary'>■</span><span className='color-accent'>▪</span>{appName}</h1>
  )

  const activeLevel = useMemo(
    () => activeLevels.find((level) => level.id === activeLevelId) ?? activeLevels[0],
    [activeLevelId, activeLevels],
  )
  
  const referenceBuffer = useMemo(() => {
    if (!activeLevel) {
      return null
    }
    /*// console.count("referenceBuffer created")*/
    return activeLevel.referenceGenerator(width, height)
  }, [activeLevel, width, height])

  useEffect(() => {
    if (!activeLevel) {
      return
    }
    const savedDims = dimensionsByLevel[activeLevel.id]
    const defaults = getDefaultDimensions(activeLevels, activeLevel.id)
    setWidth(clamp(savedDims?.width ?? defaults.width, activeLevel.minimumWidth, activeLevel.maximumWidth))
    setHeight(clamp(savedDims?.height ?? defaults.height, activeLevel.minimumHeight, activeLevel.maximumHeight))
    setCode(codeByLevel[activeLevel.id] ?? activeLevel.starterCode)
    setOutputBuffer(null)
    setStatus('idle')
    setMessage('Ready.')
    setErrorMessage(null)
    setStats(null)
  }, [activeLevelId, activeLevel, activeLevels])

  useEffect(() => {
    if (!activeLevelId) {
      return
    }
    setCodeByLevel((prev) => ({ ...prev, [activeLevelId]: code }))
  }, [activeLevelId, code])

  useEffect(() => {
    if (!activeLevel) {
      return
    }
    setDimensionsByLevel((prev) => ({
      ...prev,
      [activeLevel.id]: { width, height },
    }))
  }, [activeLevel, width, height])

  const persist = () => {
    //console.time('persist')
    const payload = {
      currentWorld,
      activeLevelId,
      levelCode: codeByLevel,
      completedLevels: Array.from(completedLevels),
      unlockedLevels: Array.from(unlockedLevels),
      levelDimensions: dimensionsByLevel,
      codeFontSize,
    }
    const serialized = JSON.stringify(payload)
    if (serialized === lastSavedRef.current) {
      return
    }
    lastSavedRef.current = serialized
    //console.timeLog('persist', 'stringified')
    saveState(payload)
    //console.timeEnd('persist')
  }

  useEffect(() => {
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current)
    }
    if (idleCallbackRef.current !== null) {
      window.cancelIdleCallback?.(idleCallbackRef.current)
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      if (window.requestIdleCallback) {
        idleCallbackRef.current = window.requestIdleCallback(() => {
          persist()
        })
      } else {
        persist()
      }
    }, 1600)

    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current)
      }
      if (idleCallbackRef.current !== null) {
        window.cancelIdleCallback?.(idleCallbackRef.current)
      }
    }
  }, [currentWorld, activeLevelId, codeByLevel, completedLevels, unlockedLevels, dimensionsByLevel])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        persist()
        setMessage('Saved.')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentWorld, activeLevelId, codeByLevel, completedLevels, unlockedLevels, dimensionsByLevel])

  const evaluateHiddenTests = async () => {
    if (!activeLevel) {
      return true
    }
    for (const test of activeLevel.hiddenTestCases) {
      const expected = activeLevel.referenceGenerator(test.width, test.height)
      // console.time('runProgram')
      const output = await runLevelCode(code, test.width, test.height)
      // console.timeLog('runProgram', 'python done')
      const result = judgeBuffers(expected, output)
      // console.timeEnd('runProgram')
      if (!result.match) {
        return false
      }
    }
    return true
  }

  const updateFontSize = (delta: number) => {
    setCodeFontSize((size) => clamp(size + delta, 10, 24))
  }

  const runProgram = async (reason: 'manual' | 'auto' | 'dimension') => {
    if (!activeLevel || !referenceBuffer) {
      return
    }
    if (!autoRunEnabled && reason !== 'manual') {
      return
    }
    // console.count("runProgram started")
    const runId = runIdRef.current + 1
    runIdRef.current = runId
    const isManual = reason === 'manual'
    if (isManual) {
      setStatus('running')
      setErrorMessage(null)
      setMessage('Running Python...')
    }

    try {
      const output = await runLevelCode(code, width, height)
      // console.count("worker completed")
      if (runId !== runIdRef.current) {
        return
      }
      const result = judgeBuffers(referenceBuffer, output)
      // console.count("output committed")
      setOutputBuffer(output)
      setStats({
        mismatchCount: result.mismatchCount,
        totalPixels: result.totalPixels,
        correctCount: result.correctCount,
        accuracy: result.accuracy,
      })
      setErrorMessage(null)

      const hiddenPass = isManual ? await evaluateHiddenTests() : true
      if (runId !== runIdRef.current) {
        return
      }

      if (isManual) {
        if (result.match && hiddenPass) {
          const nextCompleted = new Set(completedLevels)
          nextCompleted.add(activeLevel.id)
          setCompletedLevels(nextCompleted)

          const nextUnlocked = new Set(unlockedLevels)
          const currentIndex = activeLevels.findIndex((level) => level.id === activeLevel.id)
          if (currentIndex >= 0 && currentIndex < activeLevels.length - 1) {
            nextUnlocked.add(activeLevels[currentIndex + 1].id)
          }
          setUnlockedLevels(nextUnlocked)

          setStatus('passed')
          setMessage('All tests passed.')
        } else if (!result.match) {
          setStatus('failed')
          setMessage('Visible output does not match the reference.')
        } else {
          setStatus('failed')
          setMessage('Hidden tests failed. Try more sizes.')
        }
      }
    } catch (error) {
      if (runId !== runIdRef.current) {
        return
      }
      if (isManual) {
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
        setMessage('Python error.')
      }
    }
  }
  
  useEffect(() => {
    if (!activeLevel) {
      return
    }
    void runProgram('dimension')
  }, [width, height, activeLevelId, autoRunEnabled])

  useEffect(() => {
    if (!activeLevel) {
      return
    }
    if (codeRef.current === code) {
      return
    }
    codeRef.current = code
    if (!autoRunEnabled) {
      return
    }
    const handle = window.setTimeout(() => {
      void runProgram('auto')
    }, 500)
    return () => window.clearTimeout(handle)
  }, [code, activeLevelId, autoRunEnabled])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setAutoRunEnabled(true)
    }, 800)
    return () => window.clearTimeout(handle)
  }, [])

  useEffect(() => {
    if (!splitRef.current || leftWidth !== null) {
      return
    }
    const totalWidth = splitRef.current.clientWidth
    if (totalWidth > 0) {
      setLeftWidth(Math.floor(totalWidth * 0.275))
    }
  }, [leftWidth])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void warmupPyWorker()
    }, 200)
    return () => window.clearTimeout(handle)
  }, [])

  const startResize = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startLeft = leftWidth ?? (splitRef.current?.clientWidth ?? 0) / 2
    const splitWidth = splitRef.current?.clientWidth ?? 0

    const onMove = (moveEvent: MouseEvent) => {
      const nextLeft = clamp(startLeft + (moveEvent.clientX - startX), 320, splitWidth - 320)
      setLeftWidth(nextLeft)
    }

    const onStop = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onStop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onStop)
  }

  const startResizeWorldsList = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWorldsWidth = worldsListWidth ?? 60

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const nextWorldsWidth = clamp(startWorldsWidth + delta, 40, 200)
      setWorldsListWidth(nextWorldsWidth)
    }

    const onStop = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onStop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onStop)
  }

  const onReset = () => {
    if (!activeLevel) {
      return
    }
    setCode(activeLevel.starterCode)
    setStatus('idle')
    setErrorMessage(null)
    setMessage('Reset to starter code.')
  }

  const onWorldChange = (world: number) => {
    if (world === currentWorld) {
      return
    }
    const nextLevels = worlds[world - 1] ?? worlds[0]
    runIdRef.current += 1
    setCurrentWorld(world)
    setActiveLevelId(nextLevels[0]?.id ?? '')
    setUnlockedLevels((previous) => new Set([...previous, ...nextLevels.map((level) => level.id)]))
    setOutputBuffer(null)
    setStatus('idle')
    setMessage('Ready.')
    setErrorMessage(null)
    setStats(null)
  }
  

  if (!activeLevel) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div>
            {appLogo}
          </div>
          <div className="header-meta">
            <a href="https://pyodide.org/" target="_blank" rel="noopener noreferrer">Pyodide</a>
            <span> + </span>
            <a href="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noopener noreferrer">Monaco</a>
          </div>
        </header>
        <main className="main-split">
          <WorldsList currentWorld={currentWorld} onWorldChange={onWorldChange} style={worldsListWidth ? { width: `${worldsListWidth}px`, flexShrink: 0 } : undefined} />
          <div className="divider vertical worlds-list-divider" onMouseDown={startResizeWorldsList} />
          <section className="left-panel empty-world-panel">
            <div className="panel">No levels available.</div>
          </section>
        </main>
      </div>
    )
  }

  const accuracyPercent = stats ? (stats.accuracy * 100).toFixed(1) : '0.0'
  const accuracy = Number(accuracyPercent);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy == 100) return "#bced09";
    if (accuracy >= 98) return "#e4f70a";
    if (accuracy >= 95) return "#f8ec14";
    if (accuracy >= 90) return "#f9d01e";
    if (accuracy >= 80) return "#fbb628";
    if (accuracy >= 70) return "#fc9f32"; 
    if (accuracy >= 60) return "#fd8a3d"; 
    if (accuracy >= 40) return "#fd7847";   
    if (accuracy >= 20) return "#fe6951"; 
    return "#ff5c5c"; 
  };

  

  // console.count("App render");

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          {appLogo}
        </div>
        <LevelList
          levels={activeLevels}
          activeId={activeLevelId}
          completed={completedLevels}
          unlocked={unlockedLevels}
          onSelect={(id) => {
            if (!unlockedLevels.has(id)) {
              return
            }
            setActiveLevelId(id)
          }}
        />
        <div className="header-meta">
          <a href="https://pyodide.org/" target="_blank" rel="noopener noreferrer">Pyodide</a>
          <span> + </span>
          <a href="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noopener noreferrer">Monaco</a>
        </div>
      </header>
      {/* <p1 className="world-indicator">World 1: Pattern Generation</p1> */}
      
      <main className="main-split" ref={splitRef}>
        <WorldsList currentWorld={currentWorld} onWorldChange={onWorldChange} style={worldsListWidth ? { width: `${worldsListWidth}px`, flexShrink: 0 } : undefined} />

        <div className="divider vertical worlds-list-divider" onMouseDown={startResizeWorldsList} />

        <section className="left-panel" style={{ width: leftWidth ? `${leftWidth}px` : '50%' }}>
          <div className="panel left-panel-inner">
            <div className="section">
              <h1>{activeLevel.index}. {activeLevel.title}</h1>
              <div className={`difficulty-pill difficulty-pill--${activeLevel.difficulty.toLowerCase()}`}>
                {activeLevel.difficulty}
              </div>
              <hr/>
              <div className="section-title"><span>Description</span></div>
              <div>{activeLevel.description}</div>
            </div>
            <hr/>
            <div className="section">
              <CanvasPanel title="Reference" buffer={referenceBuffer} embedded />
              <CanvasPanel title="Output" buffer={outputBuffer} embedded />
            </div>
            <hr/>
            <DimensionControls
              width={width}
              height={height}
              minWidth={activeLevel.minimumWidth}
              maxWidth={activeLevel.maximumWidth}
              minHeight={activeLevel.minimumHeight}
              maxHeight={activeLevel.maximumHeight}
              step={activeLevel.dimensionStep}
              onWidthChange={(value) => setWidth(clamp(value, activeLevel.minimumWidth, activeLevel.maximumWidth))}
              onHeightChange={(value) => setHeight(clamp(value, activeLevel.minimumHeight, activeLevel.maximumHeight))}
            />
            <hr/>
            <div className="section">
              <div className="section-title">Accuracy</div>
              <div className="accuracy-row">
                <div className="accuracy-chip accuracy-chip--correct">
                  <span className="accuracy-chip__label">Correct</span>
                  <span className="accuracy-chip__value">{stats?.correctCount ?? 0}</span>
                </div>
                <div className="accuracy-chip accuracy-chip--incorrect">
                  <span className="accuracy-chip__label">Wrong</span>
                  <span className="accuracy-chip__value">{stats?.mismatchCount ?? 0}</span>
                </div>
                <div className="accuracy-chip accuracy-chip--pct">
                  <span className="accuracy-chip__label">Accuracy</span>
                  <span
                    className="accuracy-chip__value"
                    style={{ color: getAccuracyColor(accuracy) }}
                  >
                    {accuracyPercent}%
                  </span>
                </div>
              </div>
            </div>
            <hr/>
            {activeLevel.hints && activeLevel.hints.length > 0 && (
              <div className="section">
                <div className="section-title">Hints</div>
                <div className="hints">
                  {activeLevel.hints.map((hint) => (
                    <HintItem key={hint.id} hint={hint} />
                  ))}
                </div>
              <hr/>
              </div>    
            )}  
          </div>
        </section>
        <div className="divider vertical" onMouseDown={startResize} />
        <section className="right-panel">
          <EditorPanel
            code={code}
            onChange={setCode}
            isRunning={status === 'running'}
            status={status}
            message={message}
            modelPath={activeLevelId}
            errorMessage={errorMessage}
            onReset={onReset}
            onRun={() => runProgram('manual')}
            fontSize={codeFontSize}
          />
        </section>
      </main>
    </div>
  )
}

export default App