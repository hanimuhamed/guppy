import React, { useState, useEffect, useRef } from 'react'
import { worlds } from '../game/worlds'
import { useProgress } from '../context/ProgressContext'
import CanvasPanel from '../components/CanvasPanel'
import EditorPanel from '../components/EditorPanel'
import DimensionControls from '../components/DimensionControls'
import { runLevelCode } from '../runtime/runner'
import { PixelBuffer } from '../engine/pixelBuffer'
import { Footer } from '../components/Footer'

export const Home: React.FC = () => {
  const { progress } = useProgress()

  const allLevels = worlds.flat()

  let easyCount = 0, mediumCount = 0, hardCount = 0, extremeCount = 0
  let totalEasy = 0, totalMedium = 0, totalHard = 0, totalExtreme = 0
  
  allLevels.forEach(l => {
    if (l.difficulty === 'Easy') totalEasy++
    else if (l.difficulty === 'Medium') totalMedium++
    else if (l.difficulty === 'Hard') totalHard++
    else if (l.difficulty === 'Extreme') totalExtreme++
  })
  progress.completedLevels.forEach(id => {
    const level = allLevels.find(l => l.id === id)
    if (level) {
      if (level.difficulty === 'Easy') easyCount++
      else if (level.difficulty === 'Medium') mediumCount++
      else if (level.difficulty === 'Hard') hardCount++
      else if (level.difficulty === 'Extreme') extremeCount++
    }
  })
  
  const appName = 'guppy'
  const appLogo = (
    <h1 style={{fontSize: '72px'}}>
      <span className='color-primary'>■</span><span className='color-accent'>▪</span>{appName}
    </h1>
  )

  const [exampleCode, setExampleCode] = useState(`def solve(width, height):\n    # Let's draw a Puffer fish!\n    cx, cy = width // 2, height // 2\n    r = min(width, height) // 2 - 1\n    \n    for y in range(height):\n        for x in range(width):\n            dx, dy = x - cx, y - cy\n            dist_sq = dx*dx + dy*dy\n            \n            # Body \n            if dist_sq <= r*r:\n                setPixel(x, y, '#FBBF24')\n                \n            # Eyes\n            if y == cy and abs(dx) == r//2:\n                setPixel(x, y, '#1F2937')\n                \n            # Mouth\n            if y == cy + r//4 and abs(dx) <= r//4 and y > cy:\n                setPixel(x, y, '#1F2937')\n`)
  const [exampleWidth, setExampleWidth] = useState(31)
  const [exampleHeight, setExampleHeight] = useState(15)
  const [exampleOutput, setExampleOutput] = useState<PixelBuffer | null>(null)
  const [exampleError, setExampleError] = useState<string | null>(null)
  const [isExampleRunning, setIsExampleRunning] = useState(false)
  const runIdRef = useRef(0)
  const codeRef = useRef(exampleCode)
  const [autoRunEnabled, setAutoRunEnabled] = useState(false)

  const runExample = async (reason: 'manual' | 'auto' | 'dimension' = 'auto') => {
    if (!autoRunEnabled && reason !== 'manual') return
    const currentRunId = ++runIdRef.current
    
    if (reason === 'manual') {
      setIsExampleRunning(true)
      setExampleError(null)
    }

    try {
      const out = await runLevelCode(codeRef.current, exampleWidth, exampleHeight)
      if (currentRunId !== runIdRef.current) return
      setExampleOutput(out)
      setExampleError(null)
    } catch (err: any) {
      if (currentRunId !== runIdRef.current) return
      setExampleError(err.message)
    } finally {
      if (currentRunId === runIdRef.current) {
        setIsExampleRunning(false)
      }
    }
  }

  useEffect(() => {
    void runExample('dimension')
  }, [exampleWidth, exampleHeight, autoRunEnabled])

  useEffect(() => {
    if (codeRef.current === exampleCode) return
    codeRef.current = exampleCode
    if (!autoRunEnabled) return
    const handle = window.setTimeout(() => {
      void runExample('auto')
    }, 500)
    return () => window.clearTimeout(handle)
  }, [exampleCode, autoRunEnabled])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setAutoRunEnabled(true)
    }, 100)
    return () => window.clearTimeout(handle)
  }, [])

  return (
    <div className="app-shell home-container">
      <main className="home-main home-main-content">
        <header className="app-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
          {appLogo}
        </header>
        <button className='explore-levels-btn' onClick={() => window.location.href = '/levels'}>
          <code>&gt;&gt; goto
            <span style={{color: 'var(--accent)'}}>(
            <span style={{color: 'var(--string)'}}>'/levels'</span>)
            </span>
          </code>
        </button>
        <section className="about-section">
          <hr className="home-divider" />
          <h2><span style={{color:'var(--success)'}}>■</span> What is <code>
              <span style={{color: 'var(--string)'}}>'guppy'</span>
            </code></h2>
          <p>
            <code>
              <span style={{color: 'var(--string)'}}>'guppy'</span>
            </code> is a programming puzzle game where you recreate pixel art by
            writing <a style={{ color: 'var(--primary)', textDecoration: 'underline' }} href="https://docs.python.org/3/" target="_blank" rel="noopener noreferrer">Python</a> code.<br/>
            The target images change with the canvas dimensions, so your solutions 
            must work for any valid size.<br/>
            Use the built-in function <code>setPixel
              <span style={{color: 'var(--accent)'}}>(</span>
              x, y, 
              <span style={{color: 'var(--string)'}}>'#RRGGBB'</span>
              <span style={{color: 'var(--accent)'}}>)</span>
            </code> to 
            set the color of a pixel at coordinates <code>
              <span style={{color: 'var(--accent)'}}>(</span>
              x, y
              <span style={{color: 'var(--accent)'}}>)</span>
            </code>.
          </p>
          <hr className="home-divider" />
          <h2><span className='color-accent'>■</span> How to Play</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px' }}>
            <li>Open a level and study the target image.</li>
            <li>Write Python code to recreate it.</li>
            <li>Test your solution across different canvas dimensions.</li>
            <li>Pass the level by producing the correct output for every valid size.</li>
          </ul>
          <hr className="home-divider" />
          <h2><span className='color-primary'>■</span> Try it Out!</h2>
          <p style={{ color: 'var(--text)', marginBottom: '16px' }}>
            Edit the Python code below to see how it affects the canvas instantly.
          </p>
          <div className="main-split" style={{gap: '16px', height: '470px', paddingTop: '16px', paddingBottom: '16px'}}>
            <section className="left-panel" style={{ width: '40%', border: '2px solid var(--border)', background: 'var(--panel)'}}>
              <div className="left-panel-inner"  >
                <div className="section">
                  <CanvasPanel 
                    title="Live Output"
                    buffer={exampleOutput}
                    embedded
                  />
                </div>
                <hr/>
                <DimensionControls
                  width={exampleWidth}
                  height={exampleHeight}
                  minWidth={11}
                  maxWidth={33}
                  minHeight={11}
                  maxHeight={33}
                  step={2}
                  onWidthChange={w => setExampleWidth(w)}
                  onHeightChange={h => setExampleHeight(h)}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
                  Try dragging these. Watch it puff up. ↑
                </p>
              </div>
            </section>
            <section className="right-panel">
              <EditorPanel
                code={exampleCode}
                onChange={v => setExampleCode(v || '')}
                isRunning={isExampleRunning}
                status={exampleError ? 'error' : (isExampleRunning ? 'running' : 'idle')}
                message={exampleError ? 'Python error' : 'Ready'}
                modelPath="example"
                errorMessage={exampleError}
                onReset={() => {}}
                onRun={() => runExample('manual')}
                fontSize={12}
              />
            </section>
          </div>
          <hr className="home-divider" />
          <h2><span style={{color:'var(--extreme)'}}>■</span> Explore Levels</h2>
          <button className='explore-levels-btn' onClick={() => window.location.href = '/levels'}>
            <code>&gt;&gt; goto
              <span style={{color: 'var(--accent)'}}>(
              <span style={{color: 'var(--string)'}}>'/levels'</span>)
              </span>
            </code>
          </button>
        </section>
        <Footer />
      </main>    
    </div>
  )
}
