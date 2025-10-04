'use client'

export default function Home() {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between"
      style={{
        backgroundImage: 'url(/background.png)',
      }}
    >
      {/* Centered Section */}
      <div className="flex flex-col items-center text-center mt-20">
        <h1 className="main-title mb-8" style={{ 
          color: '#CBD5E1',
          fontSize: '4.5rem',
          fontWeight: '200',
          letterSpacing: '-0.03em',
          lineHeight: '1.1'
        }}>
          Beyond the Surface
        </h1>
        <div 
          className="subtitle-tags rounded-full backdrop-blur-md border border-white/20 flex items-center" 
          style={{ 
            color: '#CBD5E1',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingTop: '0.875rem',
            paddingBottom: '0.875rem',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
            gap: '2.5rem',
            fontSize: '1rem',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '400',
            borderWidth: '1px'
          }}
        >
          <span 
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '25px',
              color: '#CBD5E1',
              fontWeight: '500',
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            Aether
          </span>
          <span 
            className="nav-item"
            style={{ 
              color: '#CBD5E1', 
              opacity: 0.7,
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: '400',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              e.target.style.opacity = '0.9';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.opacity = '0.7';
              e.target.style.transform = 'translateY(0)';
            }}
          >API</span>
          <span 
            className="nav-item"
            style={{ 
              color: '#CBD5E1', 
              opacity: 0.7,
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: '400',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              e.target.style.opacity = '0.9';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.opacity = '0.7';
              e.target.style.transform = 'translateY(0)';
            }}
          >Pricing</span>
          <span 
            className="nav-item"
            style={{ 
              color: '#CBD5E1', 
              opacity: 0.7,
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: '400',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              e.target.style.opacity = '0.9';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.opacity = '0.7';
              e.target.style.transform = 'translateY(0)';
            }}
          >Team</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end mb-20 px-16">
        <p className="hero-title w-1/2">
          The single platform to score, evaluate, monitor, and map risks
        </p>
        
        <button className="portal-button" onClick={() => window.open('/map', '_blank')}>
          <span className="button-text">Explore the portal</span>
          <span className="arrow-circle">→</span>
        </button>
      </div>
    </div>
  )
}