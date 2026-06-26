import React, { useMemo, useState, useRef, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { worlds } from '../game/worlds'

import { useProgress } from '../context/ProgressContext'

import { PixelBuffer } from '../engine/pixelBuffer'
import { runLevelCode } from '../runtime/runner'
import { judgeBuffers } from '../judge/judge'
import CanvasPanel from '../components/CanvasPanel'
import DimensionControls from '../components/DimensionControls'
import EditorPanel from '../components/EditorPanel'
import HintItem from '../components/HintItem'
import { LevelDrawer } from '../components/LevelDrawer'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export const LevelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { progress, updateLevelCode, updateLevelDimensions, markLevelCompleted, updateActiveLevel } = useProgress()


  // Find level and world
  const { level, worldIndex, levelIndex } = useMemo(() => {
    for (let w = 0; w < worlds.length; w++) {
      const idx = worlds[w].findIndex(l => l.id === id)
      if (idx !== -1) {
        return { level: worlds[w][idx], worldIndex: w, levelIndex: idx }
      }
    }
    return { level: null, worldIndex: -1, levelIndex: -1 }
  }, [id])

  // Redirect if not found
  useEffect(() => {
    if (!level) {
      navigate('/levels')
    } else {
      updateActiveLevel(level.id)
    }
  }, [level, navigate])

  const worldLevels = worlds[worldIndex] || []
  const prevLevel = levelIndex > 0 ? worldLevels[levelIndex - 1] : null
  const nextLevel = levelIndex < worldLevels.length - 1 ? worldLevels[levelIndex + 1] : null

  const [code, setCode] = useState(progress.levelCode[id || ''] || '')
  
  const defaultDimensions = useMemo(() => {
    if (!level) return { width: 5, height: 5 }
    const saved = progress.levelDimensions[level.id]
    if (saved) return saved
    const width = clamp(Math.round((level.minimumWidth + level.maximumWidth) / 2), level.minimumWidth, level.maximumWidth)
    const height = clamp(Math.round((level.minimumHeight + level.maximumHeight) / 2), level.minimumHeight, level.maximumHeight)
    return { width, height }
  }, [level, progress.levelDimensions])

  const [width, setWidth] = useState(defaultDimensions.width)
  const [height, setHeight] = useState(defaultDimensions.height)

  const [outputBuffer, setOutputBuffer] = useState<PixelBuffer | null>(null)
  const [status, setStatus] = useState<'idle' | 'running' | 'passed' | 'failed' | 'error'>('idle')
  const [message, setMessage] = useState('Ready.')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const [stats, setStats] = useState<{
    mismatchCount: number
    totalPixels: number
    correctCount: number
    accuracy: number
  } | null>(null)

  const [leftWidth, setLeftWidth] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  const runIdRef = useRef(0)
  const codeRef = useRef(code)
  const splitRef = useRef<HTMLDivElement | null>(null)



  useEffect(() => {
    if (!level) return
    const savedCode = progress.levelCode[level.id]
    const initialCode = savedCode !== undefined ? savedCode : level.starterCode
    setCode(initialCode)
    codeRef.current = initialCode
    
    const savedDim = progress.levelDimensions[level.id]
    if (savedDim) {
      setWidth(savedDim.width)
      setHeight(savedDim.height)
    } else {
      const def = clamp(Math.round((level.minimumWidth + level.maximumWidth) / 2), level.minimumWidth, level.maximumWidth)
      const defH = clamp(Math.round((level.minimumHeight + level.maximumHeight) / 2), level.minimumHeight, level.maximumHeight)
      setWidth(def)
      setHeight(defH)
    }

    setOutputBuffer(null)
    setStatus('idle')
    setMessage('Ready.')
    setErrorMessage(null)
    setStats(null)
  }, [level?.id])

  const referenceBuffer = useMemo(() => {
    if (!level) return null
    return level.referenceGenerator(width, height)
  }, [level, width, height])

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode === undefined) return
    setCode(newCode)
    if (level) {
      updateLevelCode(level.id, newCode)
    }
  }

  const evaluateHiddenTests = async (currentCode: string) => {
    if (!level) {
      return true
    }
    for (const test of level.hiddenTestCases) {
      const expected = level.referenceGenerator(test.width, test.height)
      const output = await runLevelCode(currentCode, test.width, test.height)
      const result = judgeBuffers(expected, output)
      if (!result.match) {
        return false
      }
    }
    return true
  }

  const [autoRunEnabled, setAutoRunEnabled] = useState(false)

  const runProgram = async (reason: 'manual' | 'auto' | 'dimension') => {
    if (!level || !referenceBuffer) return
    if (!autoRunEnabled && reason !== 'manual') return

    const currentCode = codeRef.current
    const currentRunId = ++runIdRef.current
    const isManual = reason === 'manual'

    if (isManual) {
      setStatus('running')
      setMessage('Running Python...')
      setErrorMessage(null)
    }

    try {
      const output = await runLevelCode(currentCode, width, height)
      if (currentRunId !== runIdRef.current) return

      setOutputBuffer(output)

      const result = judgeBuffers(referenceBuffer, output)
      setStats({
        mismatchCount: result.mismatchCount,
        totalPixels: result.totalPixels,
        correctCount: result.correctCount,
        accuracy: result.accuracy,
      })
      setErrorMessage(null)

      const hiddenPass = isManual ? await evaluateHiddenTests(currentCode) : true
      if (currentRunId !== runIdRef.current) return

      if (isManual) {
        if (result.match && hiddenPass) {
          setStatus('passed')
          setMessage('All tests passed.')
          markLevelCompleted(level.id)
        } else if (!result.match) {
          setStatus('failed')
          setMessage('Visible output does not match the reference.')
        } else {
          setStatus('failed')
          setMessage('Hidden tests failed. Try more sizes.')
        }
      }
    } catch (err: any) {
      if (currentRunId !== runIdRef.current) return
      if (isManual) {
        setStatus('error')
        setMessage('Python error.')
        setErrorMessage(err.message || String(err))
      }
    }
  }

  useEffect(() => {
    if (!level) return
    void runProgram('dimension')
  }, [width, height, level?.id, autoRunEnabled])

  useEffect(() => {
    if (!level) return
    if (codeRef.current === code) return
    codeRef.current = code
    if (!autoRunEnabled) return
    const handle = window.setTimeout(() => {
      void runProgram('auto')
    }, 500)
    return () => window.clearTimeout(handle)
  }, [code, level?.id, autoRunEnabled])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setAutoRunEnabled(true)
    }, 800)
    return () => window.clearTimeout(handle)
  }, [])

  const handleWidthChange = (val: number) => {
    if (!level) return
    const w = clamp(val, level.minimumWidth, level.maximumWidth)
    setWidth(w)
    updateLevelDimensions(level.id, { width: w, height })
  }

  const handleHeightChange = (val: number) => {
    if (!level) return
    const h = clamp(val, level.minimumHeight, level.maximumHeight)
    setHeight(h)
    updateLevelDimensions(level.id, { width, height: h })
  }

  const startResizeLeft = (event: ReactMouseEvent<HTMLDivElement>) => {
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

  const onReset = () => {
    if (!level) return
    setCode(level.starterCode)
    updateLevelCode(level.id, level.starterCode)
    setStatus('idle')
    setErrorMessage(null)
    setMessage('Reset to starter code.')
  }

  useEffect(() => {
    if (!splitRef.current || leftWidth !== null) {
      return
    }
    const totalWidth = splitRef.current.clientWidth
    if (totalWidth > 0) {
      setLeftWidth(Math.floor(totalWidth * 0.275))
    }
  }, [leftWidth])

  if (!level) return null

  const appName = 'guppy'
  const appLogo = (
    <Link to="/levels" style={{ textDecoration: 'none', color: 'inherit' }}>
      <h1>
        <span className='color-primary'>■</span><span className='color-accent'>▪</span>{appName}
      </h1>
    </Link>
  )

  const accuracyPercent = stats ? (stats.accuracy * 100).toFixed(1) : '0.0'
  const accuracy = Number(accuracyPercent)

  const getAccuracyColor = (acc: number) => {
    if (acc === 100) return "#bced09"
    if (acc >= 98) return "#e4f70a"
    if (acc >= 95) return "#f8ec14"
    if (acc >= 90) return "#f9d01e"
    if (acc >= 80) return "#fbb628"
    if (acc >= 70) return "#fc9f32" 
    if (acc >= 60) return "#fd8a3d" 
    if (acc >= 40) return "#fd7847"   
    if (acc >= 20) return "#fe6951" 
    return "#ff5c5c" 
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          {appLogo}
        </div>
        
        <div className="level-nav-container">
          <Link 
            to={prevLevel ? `/levels/${prevLevel.id}` : '#'}
            className="ghost-button" 
            style={{ opacity: prevLevel ? 1 : 0.5, pointerEvents: prevLevel ? 'auto' : 'none' }}
          >
            &lt; Prev
          </Link>
          
          <div style={{ position: 'relative' }}>
            <button 
              className="ghost-button level-nav-btn" 
              onClick={() => setIsDrawerOpen(prev => !prev)}
            >
              {level.title}
            </button>
            <LevelDrawer 
              isOpen={isDrawerOpen} 
              onClose={() => setIsDrawerOpen(false)} 
              worldLevels={worldLevels} 
              worldIndex={worldIndex + 1}
              activeLevelId={level.id}
            />
          </div>

          <Link 
            to={nextLevel ? `/levels/${nextLevel.id}` : '#'}
            className="ghost-button" 
            style={{ opacity: nextLevel ? 1 : 0.5, pointerEvents: nextLevel ? 'auto' : 'none' }}
          >
            Next &gt;
          </Link>
        </div>
        
        <div className="header-meta">
          <a href="https://pyodide.org/" target="_blank" rel="noopener noreferrer">Pyodide</a>
          <span> + </span>
          <a href="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noopener noreferrer">Monaco</a>
        </div>
      </header>
      
      <main className="main-split" ref={splitRef}>
        <section className="left-panel" style={{ width: leftWidth ? `${leftWidth}px` : '50%' }}>
          <div className="panel left-panel-inner">
            <div className="section">
              <h1>{level.index}. {level.title}</h1>
              <div className={`difficulty-pill difficulty-pill--${level.difficulty.toLowerCase()}`}>
                {level.difficulty}
              </div>
              <hr/>
              <div className="section-title"><span>Description</span></div>
              <div>{level.description}</div>
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
              minWidth={level.minimumWidth}
              maxWidth={level.maximumWidth}
              minHeight={level.minimumHeight}
              maxHeight={level.maximumHeight}
              step={level.dimensionStep}
              onWidthChange={handleWidthChange}
              onHeightChange={handleHeightChange}
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
            {level.hints && level.hints.length > 0 && (
              <div className="section">
                <div className="section-title">Hints</div>
                <div className="hints">
                  {level.hints.map((hint) => (
                    <HintItem key={hint.id} hint={hint} />
                  ))}
                </div>
              <hr/>
              </div>    
            )}  
          </div>
        </section>
        <div className="divider vertical" onMouseDown={startResizeLeft} />
        <section className="right-panel">
          <EditorPanel
            code={code}
            onChange={handleCodeChange}
            isRunning={status === 'running'}
            status={status}
            message={message}
            modelPath={level.id}
            errorMessage={errorMessage}
            onReset={onReset}
            onRun={() => runProgram('manual')}
            fontSize={progress.codeFontSize || 14}
          />
        </section>
      </main>
    </div>
  )
}

export default LevelPage
