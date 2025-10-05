'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [scrollPosition, setScrollPosition] = useState(0) // 0 = Hero, 1 = API, 2 = Pricing, 3 = Team
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

  // Validación de seguridad: asegurar que scrollPosition siempre esté en rango válido
  useEffect(() => {
    if (scrollPosition < 0) {
      console.warn('⚠️ ScrollPosition fuera de rango (menor que 0):', scrollPosition)
      setScrollPosition(0)
    } else if (scrollPosition > 3) {
      console.warn('⚠️ ScrollPosition fuera de rango (mayor que 3):', scrollPosition)
      setScrollPosition(3)
    } else {
      console.log('✅ ScrollPosition válido:', scrollPosition)
    }
  }, [scrollPosition])

  useEffect(() => {
    let touchStartY = 0
    let lastScrollTime = 0
    const COOLDOWN_TIME = 800 // Tiempo de cooldown aumentado
    const MIN_SCROLL_INTERVAL = 800 // Tiempo mínimo entre scrolls
    const SCROLL_THRESHOLD = 50 // Umbral balanceado
    const MAX_POSITION = 3 // Máxima posición permitida
    const MIN_POSITION = 0 // Mínima posición permitida

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Verificaciones de seguridad
      if (isScrolling) return
      
      const now = Date.now()
      if (now - lastScrollTime < MIN_SCROLL_INTERVAL) return
      
      const delta = e.deltaY

      // Umbral más alto para evitar activaciones accidentales
      if (Math.abs(delta) >= SCROLL_THRESHOLD) {
        if (delta > 0) {
          // Scroll down - validación estricta
          if (scrollPosition >= 0 && scrollPosition < MAX_POSITION) {
            lastScrollTime = now
            setIsScrolling(true)
            setScrollPosition(prev => {
              const next = prev + 1
              return next <= MAX_POSITION ? next : prev
            })
            setTimeout(() => setIsScrolling(false), COOLDOWN_TIME)
          }
        } else {
          // Scroll up - validación estricta
          if (scrollPosition > MIN_POSITION && scrollPosition <= MAX_POSITION) {
            lastScrollTime = now
            setIsScrolling(true)
            setScrollPosition(prev => {
              const next = prev - 1
              return next >= MIN_POSITION ? next : prev
            })
            setTimeout(() => setIsScrolling(false), COOLDOWN_TIME)
          }
        }
      }
    }

    // Soporte para gestos táctiles
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return
      
      const now = Date.now()
      if (now - lastScrollTime < MIN_SCROLL_INTERVAL) return
      
      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY

      if (Math.abs(diff) >= 60) { // Umbral táctil
        if (diff > 0) {
          // Swipe up - scroll down
          if (scrollPosition >= 0 && scrollPosition < MAX_POSITION) {
            lastScrollTime = now
            setIsScrolling(true)
            setScrollPosition(prev => {
              const next = prev + 1
              return next <= MAX_POSITION ? next : prev
            })
            setTimeout(() => setIsScrolling(false), COOLDOWN_TIME)
          }
        } else {
          // Swipe down - scroll up
          if (scrollPosition > MIN_POSITION && scrollPosition <= MAX_POSITION) {
            lastScrollTime = now
            setIsScrolling(true)
            setScrollPosition(prev => {
              const next = prev - 1
              return next >= MIN_POSITION ? next : prev
            })
            setTimeout(() => setIsScrolling(false), COOLDOWN_TIME)
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [scrollPosition, isScrolling])

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
          opacity: scrollPosition === 0 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          visibility: scrollPosition === 0 ? 'visible' : 'hidden'
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
          color: scrollPosition === 3 ? 'transparent' : '#CBD5E1',
          background: scrollPosition === 3 ? 'linear-gradient(135deg, #A8DAFF, #F5B6FF, #FFC8A1)' : 'none',
          WebkitBackgroundClip: scrollPosition === 3 ? 'text' : 'none',
          WebkitTextFillColor: scrollPosition === 3 ? 'transparent' : 'inherit',
          backgroundClip: scrollPosition === 3 ? 'text' : 'none',
          fontSize: '4.5rem',
          fontWeight: '200',
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 1,
          transform: 'translateY(0)',
          textShadow: scrollPosition === 3 ? '0 4px 20px rgba(168, 218, 255, 0.3)' : 'none'
        }}>
          {scrollPosition === 0 ? 'Beyond the Surface' : scrollPosition === 1 ? 'Data Becomes Sense' : scrollPosition === 2 ? 'Simple, Transparent Pricing' : 'Meet Our Team'}
        </h1>
        <div 
          className="subtitle-tags rounded-full backdrop-blur-md border border-white/20 flex items-center" 
          style={{ 
            color: '#CBD5E1',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingTop: '0.875rem',
            paddingBottom: '0.875rem',
            background: scrollPosition === 3 ? 'linear-gradient(135deg, rgba(168, 218, 255, 0.5), rgba(245, 182, 255, 0.5), rgba(255, 200, 161, 0.5))' : 'rgba(255, 255, 255, 0.12)',
            backdropFilter: scrollPosition === 3 ? 'blur(40px) saturate(180%)' : 'blur(24px)',
            WebkitBackdropFilter: scrollPosition === 3 ? 'blur(40px) saturate(180%)' : 'blur(24px)',
            boxShadow: scrollPosition === 3 ? '0 8px 40px rgba(168, 218, 255, 0.4), 0 4px 20px rgba(245, 182, 255, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 10px rgba(255, 255, 255, 0.2)' : '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
            border: scrollPosition === 3 ? '2px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
            gap: '2.5rem',
            fontSize: '1rem',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '200',
            transition: 'all 0.5s ease'
          }}
        >
          <span 
            style={{
              background: scrollPosition === 0 ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '25px',
              color: scrollPosition === 0 ? '#FFFFFF' : (scrollPosition === 3 ? '#334155' : '#CBD5E1'),
              fontWeight: scrollPosition === 0 ? '400' : (scrollPosition === 3 ? '500' : '200'),
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              border: scrollPosition === 0 ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
              boxShadow: scrollPosition === 0 ? '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'none',
              opacity: scrollPosition === 0 ? 1 : (scrollPosition === 3 ? 0.9 : 0.5),
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textShadow: scrollPosition === 3 ? '0 1px 3px rgba(255, 255, 255, 0.5)' : 'none'
            }}
            onClick={() => setScrollPosition(0)}
            onMouseEnter={(e) => {
              if (scrollPosition !== 0) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (scrollPosition !== 0) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.opacity = '0.5';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            Aether
          </span>
          <span 
            className="nav-item"
            style={{ 
              color: scrollPosition === 1 ? '#FFFFFF' : (scrollPosition === 3 ? '#334155' : '#CBD5E1'),
              opacity: scrollPosition === 1 ? 1 : (scrollPosition === 3 ? 0.9 : 0.5),
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: scrollPosition === 1 ? '400' : (scrollPosition === 3 ? '500' : '200'),
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: scrollPosition === 1 ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              border: scrollPosition === 1 ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
              boxShadow: scrollPosition === 1 ? '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'none',
              textShadow: scrollPosition === 3 ? '0 1px 3px rgba(255, 255, 255, 0.5)' : 'none'
            }}
            onClick={() => setScrollPosition(1)}
            onMouseEnter={(e) => {
              if (scrollPosition !== 1) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (scrollPosition !== 1) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.opacity = '0.5';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >API</span>
          <span 
            className="nav-item"
            style={{ 
              color: scrollPosition === 2 ? '#FFFFFF' : (scrollPosition === 3 ? '#334155' : '#CBD5E1'),
              opacity: scrollPosition === 2 ? 1 : (scrollPosition === 3 ? 0.9 : 0.5),
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: scrollPosition === 2 ? '400' : (scrollPosition === 3 ? '500' : '200'),
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: scrollPosition === 2 ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              border: scrollPosition === 2 ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
              boxShadow: scrollPosition === 2 ? '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'none',
              textShadow: scrollPosition === 3 ? '0 1px 3px rgba(255, 255, 255, 0.5)' : 'none'
            }}
            onClick={() => setScrollPosition(2)}
            onMouseEnter={(e) => {
              if (scrollPosition !== 2) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (scrollPosition !== 2) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.opacity = '0.5';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >Pricing</span>
          <span 
            className="nav-item"
            style={{ 
              color: scrollPosition === 3 ? '#334155' : '#CBD5E1',
              opacity: scrollPosition === 3 ? 1 : 0.5,
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: scrollPosition === 3 ? '600' : '200',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: scrollPosition === 3 ? 'rgba(255, 255, 255, 0.35)' : 'transparent',
              border: scrollPosition === 3 ? '1px solid rgba(255, 255, 255, 0.6)' : 'none',
              boxShadow: scrollPosition === 3 ? '0 4px 12px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)' : 'none',
              textShadow: scrollPosition === 3 ? '0 1px 3px rgba(255, 255, 255, 0.8)' : 'none'
            }}
            onClick={() => setScrollPosition(3)}
            onMouseEnter={(e) => {
              if (scrollPosition !== 3) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (scrollPosition !== 3) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.opacity = '0.5';
                e.currentTarget.style.transform = 'translateY(0)';
              }
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
          setScrollPosition(0)
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
        }} style={{
          background: scrollPosition === 3 ? 'linear-gradient(135deg, rgba(168, 218, 255, 0.5), rgba(245, 182, 255, 0.5), rgba(255, 200, 161, 0.5))' : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: scrollPosition === 3 ? 'blur(40px) saturate(180%)' : 'blur(20px)',
          WebkitBackdropFilter: scrollPosition === 3 ? 'blur(40px) saturate(180%)' : 'blur(20px)',
          boxShadow: scrollPosition === 3 ? '0 8px 40px rgba(168, 218, 255, 0.4), 0 4px 20px rgba(245, 182, 255, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 10px rgba(255, 255, 255, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2)',
          border: scrollPosition === 3 ? '2px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.5s ease',
          color: scrollPosition === 3 ? '#334155' : 'white',
          fontWeight: scrollPosition === 3 ? '500' : '200'
        }}>
          <span className="button-text">Explore the portal</span>
          <span className="arrow-circle">→</span>
        </button>
      </div>

      {/* Segunda sección - API */}
      <div 
        className="h-screen w-full flex items-center justify-center"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          transform: scrollPosition === 1 ? 'translateY(0)' : scrollPosition === 0 ? 'translateY(100vh)' : 'translateY(-100vh)',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 50,
          pointerEvents: scrollPosition === 1 ? 'auto' : 'none'
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
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            marginBottom: '4rem'
          }}>
            Aether transforms geospatial data<br />
            into live, contextual intelligence<br />
            ready to integrate anywhere.
          </h2>
          
          {/* Iconos con descripciones */}
          <div style={{
            display: 'flex',
            gap: '3rem',
            marginTop: '3rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Living Data */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image
                src="/graphic.png"
                alt="Living Data"
                width={240}
                height={240}
                style={{
                  objectFit: 'contain',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  transform: hoveredIcon === 'living' ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredIcon('living')}
                onMouseLeave={() => setHoveredIcon(null)}
              />
              {/* Tooltip */}
              <div style={{
                position: 'absolute',
                top: '-140px',
                left: '50%',
                transform: hoveredIcon === 'living' ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
                background: 'linear-gradient(135deg, rgba(226, 232, 240, 1), rgba(203, 213, 225, 1))',
                borderRadius: '20px',
                padding: '1.75rem 2rem',
                minWidth: '280px',
                textAlign: 'center',
                opacity: hoveredIcon === 'living' ? 1 : 0,
                visibility: hoveredIcon === 'living' ? 'visible' : 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1000,
                pointerEvents: 'none',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
              }}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '200',
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  letterSpacing: '-0.03em'
                }}>Living Data</h3>
                <p style={{
                  fontSize: '0.95rem',
                  fontWeight: '200',
                  color: '#475569',
                  lineHeight: '1.5',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  letterSpacing: '0.01em'
                }}>Signals that evolve in real time.</p>
              </div>
            </div>

            {/* Adaptive Systems */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image
                src="/build.png"
                alt="Adaptive Systems"
                width={240}
                height={240}
                style={{
                  objectFit: 'contain',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  transform: hoveredIcon === 'adaptive' ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredIcon('adaptive')}
                onMouseLeave={() => setHoveredIcon(null)}
              />
              {/* Tooltip */}
              <div style={{
                position: 'absolute',
                top: '-140px',
                left: '50%',
                transform: hoveredIcon === 'adaptive' ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
                background: 'linear-gradient(135deg, rgba(226, 232, 240, 1), rgba(203, 213, 225, 1))',
                borderRadius: '20px',
                padding: '1.75rem 2rem',
                minWidth: '280px',
                textAlign: 'center',
                opacity: hoveredIcon === 'adaptive' ? 1 : 0,
                visibility: hoveredIcon === 'adaptive' ? 'visible' : 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1000,
                pointerEvents: 'none',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
              }}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '200',
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  letterSpacing: '-0.03em'
                }}>Adaptive Systems</h3>
                <p style={{
                  fontSize: '0.95rem',
                  fontWeight: '200',
                  color: '#475569',
                  lineHeight: '1.5',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  letterSpacing: '0.01em'
                }}>Designed to learn and scale.</p>
              </div>
            </div>

            {/* Modular Design */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image
                src="/arm.png"
                alt="Modular Design"
                width={240}
                height={240}
                style={{
                  objectFit: 'contain',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  transform: hoveredIcon === 'modular' ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredIcon('modular')}
                onMouseLeave={() => setHoveredIcon(null)}
              />
              {/* Tooltip */}
              <div style={{
                position: 'absolute',
                top: '-140px',
                left: '50%',
                transform: hoveredIcon === 'modular' ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
                background: 'linear-gradient(135deg, rgba(226, 232, 240, 1), rgba(203, 213, 225, 1))',
                borderRadius: '20px',
                padding: '1.75rem 2rem',
                minWidth: '280px',
                textAlign: 'center',
                opacity: hoveredIcon === 'modular' ? 1 : 0,
                visibility: hoveredIcon === 'modular' ? 'visible' : 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1000,
                pointerEvents: 'none',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
              }}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '200',
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  letterSpacing: '-0.03em'
                }}>Modular Design</h3>
                <p style={{
                  fontSize: '0.95rem',
                  fontWeight: '200',
                  color: '#475569',
                  lineHeight: '1.5',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  letterSpacing: '0.01em'
                }}>Use only what you need.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tercera sección - Pricing */}
      <div 
        className="h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          transform: scrollPosition === 2 ? 'translateY(0)' : scrollPosition === 3 ? 'translateY(-100vh)' : scrollPosition === 1 ? 'translateY(100vh)' : 'translateY(200vh)',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundImage: 'url(/background2.png)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 60,
          pointerEvents: scrollPosition === 2 ? 'auto' : 'none'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          width: '100%',
          padding: '0 40px'
        }}>
          {/* Pricing Bubbles */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1.5rem',
                position: 'relative',
                marginTop: '8rem'
              }}>
            {/* Starter Bubble */}
            <div 
                onClick={() => setExpandedPlan(expandedPlan === 'starter' ? null : 'starter')}
                style={{
                  width: expandedPlan === 'starter' ? '260px' : '180px',
                  height: expandedPlan === 'starter' ? '340px' : '180px',
                borderRadius: expandedPlan === 'starter' ? '30px' : '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                padding: '2rem'
              }}
              onMouseEnter={(e) => {
                if (expandedPlan !== 'starter') {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (expandedPlan !== 'starter') {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <h3 style={{
                fontSize: expandedPlan === 'starter' ? '1.5rem' : '1.3rem',
                fontWeight: '200',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'all 0.5s ease',
                textAlign: 'center',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>Starter</h3>
              <div style={{
                fontSize: expandedPlan === 'starter' ? '3rem' : '2.2rem',
                fontWeight: '200',
                color: '#FFFFFF',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'all 0.5s ease',
                marginBottom: expandedPlan === 'starter' ? '0.5rem' : '0',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                <span style={{ fontSize: '1.3rem', verticalAlign: 'super' }}>$</span>49
                <span style={{ fontSize: '0.9rem', fontWeight: '200', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginTop: '-0.5rem' }}>/month</span>
              </div>
              {expandedPlan === 'starter' && (
                <div style={{
                  marginTop: '0.8rem',
                  animation: 'fadeIn 0.5s ease',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '80%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    marginBottom: '0.7rem'
                  }} />
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#FFFFFF',
                    marginBottom: '0.8rem',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: '400',
                    textAlign: 'center',
                    textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                    letterSpacing: '0.03em'
                  }}>Perfect for small projects</p>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    width: '100%',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                  }}>
                    {['1,000 API calls/month', 'Basic analytics', 'Email support', '1 user seat'].map((feature, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.6rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '0.4rem 0.7rem',
                        borderRadius: '10px',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            color: '#FFFFFF',
                            fontWeight: '700'
                          }}>✓</span>
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#FFFFFF',
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          fontWeight: '400',
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                          lineHeight: '1.2'
                        }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Professional Bubble - POPULAR */}
            <div 
              onClick={() => setExpandedPlan(expandedPlan === 'professional' ? null : 'professional')}
              style={{
                width: expandedPlan === 'professional' ? '270px' : '220px',
                height: expandedPlan === 'professional' ? '390px' : '220px',
                borderRadius: expandedPlan === 'professional' ? '30px' : '50%',
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '3px solid rgba(255, 255, 255, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                padding: '2rem',
                transform: expandedPlan === 'professional' ? 'scale(1)' : 'scale(1.1)'
              }}
              onMouseEnter={(e) => {
                if (expandedPlan !== 'professional') {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.15)';
                  e.currentTarget.style.boxShadow = '0 24px 80px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (expandedPlan !== 'professional') {
                  e.currentTarget.style.transform = 'translateY(0) scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)';
                }
              }}
            >
              {expandedPlan !== 'professional' && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.1em'
                }}>
                  POPULAR
                </div>
              )}
              <h3 style={{
                fontSize: expandedPlan === 'professional' ? '1.6rem' : '1.4rem',
                fontWeight: '200',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'all 0.5s ease',
                textAlign: 'center',
                marginTop: expandedPlan === 'professional' ? '0' : '1.5rem',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>Professional</h3>
              <div style={{
                fontSize: expandedPlan === 'professional' ? '3.2rem' : '2.5rem',
                fontWeight: '200',
                color: '#FFFFFF',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'all 0.5s ease',
                marginBottom: expandedPlan === 'professional' ? '0.5rem' : '0',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                <span style={{ fontSize: '1.5rem', verticalAlign: 'super' }}>$</span>149
                <span style={{ fontSize: '1rem', fontWeight: '200', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginTop: '-0.5rem' }}>/month</span>
              </div>
              {expandedPlan === 'professional' && (
                <div style={{
                  marginTop: '0.8rem',
                  animation: 'fadeIn 0.5s ease',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '80%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                    marginBottom: '0.7rem'
                  }} />
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.35rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.6rem',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    letterSpacing: '0.15em',
                    textAlign: 'center',
                    marginBottom: '0.7rem',
                    textShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}>
                    POPULAR
                  </div>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#FFFFFF',
                    marginBottom: '0.8rem',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: '400',
                    textAlign: 'center',
                    textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                    letterSpacing: '0.03em'
                  }}>For growing businesses</p>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    width: '100%',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                  }}>
                    {['10,000 API calls/month', 'Advanced analytics', 'Priority support', '5 user seats', 'Custom integrations'].map((feature, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.6rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.4rem 0.7rem',
                        borderRadius: '10px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                        }}>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            color: '#FFFFFF',
                            fontWeight: '700'
                          }}>✓</span>
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#FFFFFF',
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          fontWeight: '400',
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                          lineHeight: '1.2'
                        }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enterprise Bubble */}
            <div 
              onClick={() => setExpandedPlan(expandedPlan === 'enterprise' ? null : 'enterprise')}
              style={{
                width: expandedPlan === 'enterprise' ? '260px' : '180px',
                height: expandedPlan === 'enterprise' ? '380px' : '180px',
                borderRadius: expandedPlan === 'enterprise' ? '30px' : '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                padding: '2rem'
              }}
              onMouseEnter={(e) => {
                if (expandedPlan !== 'enterprise') {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (expandedPlan !== 'enterprise') {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <h3 style={{
                fontSize: expandedPlan === 'enterprise' ? '1.5rem' : '1.3rem',
                fontWeight: '200',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'all 0.5s ease',
                textAlign: 'center',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>Enterprise</h3>
              <div style={{
                fontSize: expandedPlan === 'enterprise' ? '2.5rem' : '2rem',
                fontWeight: '200',
                color: '#FFFFFF',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'all 0.5s ease',
                marginBottom: expandedPlan === 'enterprise' ? '0.5rem' : '0',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                Custom
              </div>
              {expandedPlan === 'enterprise' && (
                <div style={{
                  marginTop: '0.6rem',
                  animation: 'fadeIn 0.5s ease',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '80%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    marginBottom: '0.5rem'
                  }} />
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#FFFFFF',
                    marginBottom: '0.6rem',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: '400',
                    textAlign: 'center',
                    textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                    letterSpacing: '0.03em'
                  }}>Tailored for large teams</p>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    width: '100%',
                    paddingLeft: '0.9rem',
                    paddingRight: '0.9rem'
                  }}>
                    {['Unlimited API calls', 'Enterprise analytics', '24/7 dedicated support', 'Unlimited seats', 'Custom features', 'SLA guarantee'].map((feature, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '10px',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <span style={{ 
                            fontSize: '0.6rem', 
                            color: '#FFFFFF',
                            fontWeight: '700'
                          }}>✓</span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          color: '#FFFFFF',
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          fontWeight: '400',
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                          lineHeight: '1.15'
                        }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cuarta sección - Team */}
      <div 
        className="h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          transform: scrollPosition === 3 ? 'translateY(0)' : scrollPosition === 2 ? 'translateY(100vh)' : scrollPosition === 1 ? 'translateY(200vh)' : 'translateY(300vh)',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          background: '#FFFFFF',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
          zIndex: 70,
          pointerEvents: scrollPosition === 3 ? 'auto' : 'none',
          overflow: 'visible'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          width: '100%',
          padding: '0 40px',
          overflow: 'visible',
          height: '100%'
        }}>
          {/* Team Members */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: '2rem',
            paddingLeft: '4rem',
            paddingRight: '4rem',
            paddingBottom: '4rem',
            minHeight: 'calc(100vh - 4rem)'
          }}>
            {/* Team Member 1 - Carlos */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              marginTop: '20rem'
            }}>
                  {/* Avatar Circle */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '3px solid rgba(71, 85, 105, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.5)',
                    overflow: 'hidden'
                  }}>
                    <Image 
                      src="/carlos.jpeg" 
                      alt="Carlos Zendejas" 
                      width={120}
                      height={120}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        objectPosition: 'center 60%'
                      }}
                    />
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    color: '#1E293B',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    textShadow: 'none'
                  }}>Carlos Zendejas</h3>
                  
                  {/* Social Icons */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '0.75rem',
                    alignItems: 'center'
                  }}>
                    <a href="https://www.instagram.com/carlos5658/" target="_blank" rel="noopener noreferrer" style={{
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center'
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <Image 
                        src="/instagram.jpg" 
                        alt="Instagram" 
                        width={50}
                        height={50}
                        style={{
                          objectFit: 'contain'
                        }}
                      />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" style={{
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center'
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <Image 
                        src="/linkedin.jpg" 
                        alt="LinkedIn" 
                        width={28}
                        height={28}
                        style={{
                          objectFit: 'contain'
                        }}
                      />
                    </a>
                  </div>
            </div>

            {/* Video en el medio */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              maxWidth: '450px',
              width: '100%',
              marginTop: '20rem'
            }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: 'none',
                  border: 'none',
                  objectFit: 'contain'
                }}
              >
                <source src="/video.mov" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Team Member 2 - Arturo */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              marginTop: '20rem'
            }}>
                  {/* Avatar Circle */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '3px solid rgba(71, 85, 105, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.5)',
                    overflow: 'hidden'
                  }}>
                    <Image 
                      src="/arturo.jpeg" 
                      alt="Arturo Ordaz" 
                      width={120}
                      height={120}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        objectPosition: 'center 60%'
                      }}
                    />
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    color: '#1E293B',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    textShadow: 'none'
                  }}>Arturo Ordaz</h3>
                  
                  {/* Social Icons */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '0.75rem',
                    alignItems: 'center'
                  }}>
                    <a href="https://www.instagram.com/by.arturo_/" target="_blank" rel="noopener noreferrer" style={{
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center'
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <Image 
                        src="/instagram.jpg" 
                        alt="Instagram" 
                        width={50}
                        height={50}
                        style={{
                          objectFit: 'contain'
                        }}
                      />
                    </a>
                    <a href="https://www.linkedin.com/in/arturo-o-41371424a/" target="_blank" rel="noopener noreferrer" style={{
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center'
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <Image 
                        src="/linkedin.jpg" 
                        alt="LinkedIn" 
                        width={28}
                        height={28}
                        style={{
                          objectFit: 'contain'
                        }}
                      />
                    </a>
                  </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}