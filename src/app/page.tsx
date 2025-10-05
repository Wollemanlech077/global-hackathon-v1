'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50 && !scrolled) {
        setScrolled(true)
      } else if (e.deltaY < -50 && scrolled) {
        setScrolled(false)
      }
    }

    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [scrolled])

  return (
    <div className="page-container" style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Primera sección - Hero (fija) */}
      <div
        className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between fixed top-0 left-0"
        style={{
          backgroundImage: 'url(/background.png)',
          zIndex: 1
        }}
      >
      <div className="mt-20" style={{ opacity: 0, pointerEvents: 'none' }}>
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
          className="subtitle-tags rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto" 
          style={{ 
            color: '#CBD5E1',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingTop: '0.875rem',
            paddingBottom: '0.875rem',
            width: 'fit-content'
          }}
        >
          <span>Aether</span>
          <span>API</span>
          <span>Pricing</span>
          <span>Team</span>
        </div>
      </div>

      <div 
        className="flex justify-start items-end mb-20 px-16"
        style={{
          position: 'relative',
          zIndex: 10,
          opacity: scrolled ? 0 : 1,
          transition: 'opacity 0.5s ease',
          visibility: scrolled ? 'hidden' : 'visible'
        }}
      >
        <p className="hero-title w-1/2">
          The single platform to score, evaluate, monitor, and map risks
        </p>
      </div>
      </div>

      <div 
        className="flex flex-col items-center text-center"
        style={{
          position: 'fixed',
          top: '-25px',
          left: '0',
          right: '0',
          zIndex: 100
        }}
      >
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
            fontWeight: '200',
            borderWidth: '1px'
          }}
        >
          <span 
            style={{
              background: scrolled ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '25px',
              color: '#CBD5E1',
              fontWeight: '200',
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              border: scrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: scrolled ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
              opacity: scrolled ? 0.7 : 1,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => setScrolled(false)}
          >
            Aether
          </span>
          <span 
            className="nav-item"
            style={{ 
              color: '#CBD5E1', 
              opacity: scrolled ? 1 : 0.7,
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: '200',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: scrolled ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              border: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              boxShadow: scrolled ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onClick={() => setScrolled(true)}
            onMouseEnter={(e) => {
              if (!scrolled) {
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.opacity = '0.9';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!scrolled) {
                e.target.style.background = 'transparent';
                e.target.style.opacity = '0.7';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >API</span>
          <span 
            className="nav-item"
            style={{ 
              color: '#CBD5E1', 
              opacity: 0.7,
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: '200',
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
              fontWeight: '200',
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

      <div 
        style={{
          position: 'fixed',
          top: '30px',
          left: '30px',
          zIndex: 9999,
          cursor: 'pointer'
        }}
        onClick={() => {
          setScrolled(false)
          setTimeout(() => {
            router.push('/')
          }, 1500)
        }}
      >
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={48}
          height={48}
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        />
      </div>


      <div 
        style={{
          position: 'fixed',
          bottom: '0px',
          right: '-25px',
          zIndex: 9999
        }}
      >
        <button className="portal-button" onClick={() => {
          router.push('/map');
        }}>
          <span className="button-text">Explore the portal</span>
          <span className="arrow-circle">→</span>
        </button>
      </div>

      <div 
        className="h-screen w-full flex items-center justify-center"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          transform: scrolled ? 'translateY(0)' : 'translateY(100vh)',
          transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 50
        }}
      >
        <div style={{
          position: 'absolute',
          left: '30px',
          top: '230px',
          maxWidth: '1400px',
          zIndex: 51
        }}>
          <h2 style={{
            fontSize: '4rem',
            fontWeight: '200',
            color: '#CBD5E1',
            lineHeight: '1.0',
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            Aether transforms geospatial data<br />
            into live, contextual intelligence<br />
            ready to integrate anywhere.
          </h2>
        </div>
      </div>
    </div>
  )
}