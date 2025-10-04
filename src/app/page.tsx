'use client'

export default function Home() {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between"
      style={{
        backgroundImage: 'url(/background.png)',
      }}
    >
      {/* Top Section */}
      <div className="flex flex-col items-end mt-16 px-16">
        <h1 className="main-title text-6xl mb-6" style={{ color: '#CBD5E1' }}>
          Step Beyond the Ordinary
        </h1>
        <div 
          className="subtitle-tags rounded-full backdrop-blur-md border border-white/30 flex items-center text-base" 
          style={{ 
            color: '#CBD5E1',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.65rem',
            paddingBottom: '0.65rem',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2)',
            gap: '1.5rem'
          }}
        >
          <span>Portal</span>
          <span style={{ color: '#CBD5E1', fontSize: '1.2em' }}>•</span>
          <span>Flow State</span>
          <span style={{ color: '#CBD5E1', fontSize: '1.2em' }}>•</span>
          <span>Limitless Canvas</span>
          <span style={{ color: '#CBD5E1', fontSize: '1.2em' }}>•</span>
          <span>Cloud collaboration</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end mb-20 px-16">
        <p className="hero-title w-1/2">
          The single platform to iterate, evaluate, deploy, and monitor LLMs
        </p>
        
              <button className="portal-button" onClick={() => window.open('/map', '_blank')}>
                <span className="button-text">Explore the portal</span>
                <span className="arrow-circle">→</span>
              </button>
      </div>
    </div>
  )
}