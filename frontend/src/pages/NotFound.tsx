import React from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'

export const NotFound: React.FC = () => {
  return (
    <div className="app-shell home-container">
      <main className="home-main home-main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <h1 style={{ fontSize: '120px', color: 'var(--danger)', marginBottom: '0'}}>404</h1>
        <h2 style={{ fontSize: '32px', color: 'var(--text)', marginBottom: '0' }}><code>&gt;&gt; <span style={{color: 'var(--string)'}}>page not found</span></code></h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0px', textAlign: 'center' }}>
          PageNotFoundError: The canvas ends here.
        </p>
        <Link to="/" className="ghost-button home-logout-btn">
          sys.exit()
        </Link>
        <Footer />
      </main>
      
    </div>
  )
}
