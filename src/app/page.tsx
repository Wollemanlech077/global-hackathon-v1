'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [scrollPosition, setScrollPosition] = useState(0) // 0 = Hero, 1 = API, 2 = Pricing
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isScrolling) return // Prevenir scrolls múltiples

      if (e.deltaY > 50) {
        // Scroll down
        if (scrollPosition < 2) {
          setIsScrolling(true)
          setScrollPosition(prev => prev + 1)
          setTimeout(() => setIsScrolling(false), 1500) // Esperar a que termine la transición
        }
      } else if (e.deltaY < -50) {
        // Scroll up
        if (scrollPosition > 0) {
          setIsScrolling(true)
          setScrollPosition(prev => prev - 1)
          setTimeout(() => setIsScrolling(false), 1500) // Esperar a que termine la transición
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
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
          color: '#CBD5E1',
          fontSize: '4.5rem',
          fontWeight: '200',
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 1,
          transform: 'translateY(0)'
        }}>
          {scrollPosition === 0 ? 'Beyond the Surface' : scrollPosition === 1 ? 'Data Becomes Sense' : 'Simple, Transparent Pricing'}
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
              background: scrollPosition === 0 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '25px',
              color: '#CBD5E1',
              fontWeight: '200',
              fontSize: '1rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              border: scrollPosition === 0 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              boxShadow: scrollPosition === 0 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              opacity: scrollPosition === 0 ? 1 : 0.7,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => setScrollPosition(0)}
          >
            Aether
          </span>
          <span 
            className="nav-item"
            style={{ 
              color: '#CBD5E1', 
              opacity: scrollPosition === 1 ? 1 : 0.7,
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
              background: scrollPosition === 1 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              border: scrollPosition === 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              boxShadow: scrollPosition === 1 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onClick={() => setScrollPosition(1)}
            onMouseEnter={(e) => {
              if (scrollPosition !== 1) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (scrollPosition !== 1) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >API</span>
          <span 
            className="nav-item"
            style={{ 
              color: '#CBD5E1', 
              opacity: scrollPosition === 2 ? 1 : 0.7,
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
              background: scrollPosition === 2 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              border: scrollPosition === 2 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              boxShadow: scrollPosition === 2 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onClick={() => setScrollPosition(2)}
            onMouseEnter={(e) => {
              if (scrollPosition !== 2) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (scrollPosition !== 2) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.transform = 'translateY(0)';
              }
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
          transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
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
        className="h-screen w-full flex items-center justify-center"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          transform: scrollPosition === 2 ? 'translateY(0)' : scrollPosition === 1 ? 'translateY(100vh)' : 'translateY(200vh)',
          transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 60,
          pointerEvents: scrollPosition === 2 ? 'auto' : 'none'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          padding: '0 40px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '200',
            color: '#CBD5E1',
            textAlign: 'center',
            marginBottom: '3rem',
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            Choose the plan that fits your needs
          </h2>

          {/* Pricing Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {/* Plan Básico */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '200',
                color: '#CBD5E1',
                marginBottom: '1rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>Starter</h3>
              <div style={{
                fontSize: '3rem',
                fontWeight: '200',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                <span style={{ fontSize: '1.5rem', verticalAlign: 'super' }}>$</span>49
                <span style={{ fontSize: '1.2rem', fontWeight: '200', color: '#CBD5E1' }}>/mo</span>
              </div>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(203, 213, 225, 0.8)',
                marginBottom: '2rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '200'
              }}>Perfect for small projects</p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.95rem',
                color: '#CBD5E1',
                lineHeight: '2',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '200'
              }}>
                <li>✓ 1,000 API calls/month</li>
                <li>✓ Basic analytics</li>
                <li>✓ Email support</li>
                <li>✓ 1 user seat</li>
              </ul>
            </div>

            {/* Plan Profesional */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              transform: 'scale(1.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '400',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                letterSpacing: '0.05em'
              }}>
                POPULAR
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '200',
                color: '#CBD5E1',
                marginBottom: '1rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>Professional</h3>
              <div style={{
                fontSize: '3rem',
                fontWeight: '200',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                <span style={{ fontSize: '1.5rem', verticalAlign: 'super' }}>$</span>149
                <span style={{ fontSize: '1.2rem', fontWeight: '200', color: '#CBD5E1' }}>/mo</span>
              </div>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(203, 213, 225, 0.8)',
                marginBottom: '2rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '200'
              }}>For growing businesses</p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.95rem',
                color: '#CBD5E1',
                lineHeight: '2',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '200'
              }}>
                <li>✓ 10,000 API calls/month</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
                <li>✓ 5 user seats</li>
                <li>✓ Custom integrations</li>
              </ul>
            </div>

            {/* Plan Enterprise */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '200',
                color: '#CBD5E1',
                marginBottom: '1rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>Enterprise</h3>
              <div style={{
                fontSize: '3rem',
                fontWeight: '200',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                Custom
              </div>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(203, 213, 225, 0.8)',
                marginBottom: '2rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '200'
              }}>Tailored for large teams</p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.95rem',
                color: '#CBD5E1',
                lineHeight: '2',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '200'
              }}>
                <li>✓ Unlimited API calls</li>
                <li>✓ Enterprise analytics</li>
                <li>✓ 24/7 dedicated support</li>
                <li>✓ Unlimited seats</li>
                <li>✓ Custom features</li>
                <li>✓ SLA guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}