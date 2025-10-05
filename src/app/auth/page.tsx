'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { auth } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

export default function AuthPage() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        // Si el usuario está autenticado, redirigir al mapa
        router.push('/map')
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [router])


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      // La redirección se maneja en el useEffect
    } catch (error: any) {
      
      // Manejar errores específicos de Firebase
      let errorMessage = 'Error al iniciar sesión: '
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage += 'No existe una cuenta con este correo electrónico'
          break
        case 'auth/wrong-password':
          errorMessage += 'Contraseña incorrecta'
          break
        case 'auth/invalid-email':
          errorMessage += 'Correo electrónico inválido'
          break
        case 'auth/too-many-requests':
          errorMessage += 'Demasiados intentos fallidos. Intenta más tarde'
          break
        case 'auth/configuration-not-found':
          errorMessage += 'Configuración de Firebase no encontrada. Por favor, verifica la configuración.'
          break
        case 'auth/network-request-failed':
          errorMessage += 'Error de conexión. Verifica tu internet.'
          break
        default:
          errorMessage += error.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // La redirección se maneja en el useEffect
    } catch (error: any) {
      
      // Manejar errores específicos de Firebase
      let errorMessage = 'Error al crear la cuenta: '
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage += 'Este correo electrónico ya está registrado'
          break
        case 'auth/invalid-email':
          errorMessage += 'Correo electrónico inválido'
          break
        case 'auth/weak-password':
          errorMessage += 'La contraseña no cumple con los requisitos de seguridad'
          break
        case 'auth/configuration-not-found':
          errorMessage += 'Configuración de Firebase no encontrada. Por favor, verifica la configuración.'
          break
        case 'auth/network-request-failed':
          errorMessage += 'Error de conexión. Verifica tu internet.'
          break
        default:
          errorMessage += error.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      // Error silencioso
    }
  }

  const openLoginModal = () => {
    setShowLoginModal(true)
    setShowRegisterModal(false)
    setError('')
  }

  const openRegisterModal = () => {
    setShowRegisterModal(true)
    setShowLoginModal(false)
    setError('')
  }

  const closeModals = () => {
    setShowLoginModal(false)
    setShowRegisterModal(false)
    setError('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-end"
      style={{
        backgroundImage: 'url(/background.png)',
      }}
    >
      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '15px' : '30px',
        left: isMobile ? '15px' : '30px',
        zIndex: 10,
        cursor: 'pointer'
      }}
      onClick={() => router.push('/')}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={isMobile ? 36 : 48}
          height={isMobile ? 36 : 48}
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

      {/* Bottom Section */}
      {!showLoginModal && !showRegisterModal && (
        <div className="flex justify-center items-center" style={{
          paddingBottom: isMobile ? '3rem' : '5rem'
        }}>
          <div className="flex gap-4" style={{
            flexDirection: isMobile ? 'column' : 'row',
            width: isMobile ? '100%' : 'auto',
            padding: isMobile ? '0 2rem' : '0'
          }}>
            <button className="portal-button" onClick={openLoginModal} style={{
              width: isMobile ? '100%' : 'auto'
            }}>
              <span className="button-text">Sign In</span>
              <span className="arrow-circle">→</span>
            </button>
            
            <button className="portal-button" onClick={openRegisterModal} style={{
              width: isMobile ? '100%' : 'auto'
            }}>
              <span className="button-text">Create Account</span>
              <span className="arrow-circle">+</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
          style={{ 
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9999,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeModals}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: isMobile ? '16px' : '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 16px 48px rgba(0, 0, 0, 0.2)',
              width: isMobile ? '90%' : '420px',
              maxWidth: '100%',
              maxHeight: '80vh',
              overflowY: 'auto' as const,
              overflowX: 'hidden' as const,
              position: 'relative' as const
            }}
          >
            <div className="auth-modal-header">
              <h2 className="auth-modal-title" style={{
                fontSize: isMobile ? '1.5rem' : '1.75rem'
              }}>Sign In</h2>
              <button
                onClick={closeModals}
                className="auth-modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLogin} className="auth-modal-content">
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}
              
              <div className="auth-input-group">
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-modal-footer">
              <p className="auth-switch-text">
                Don't have an account?{' '}
                <button
                  onClick={openRegisterModal}
                  className="auth-switch-button"
                  disabled={loading}
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro */}
      {showRegisterModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
          style={{ 
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9999,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeModals}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: isMobile ? '16px' : '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 16px 48px rgba(0, 0, 0, 0.2)',
              width: isMobile ? '90%' : '420px',
              maxWidth: '100%',
              maxHeight: '80vh',
              overflowY: 'auto' as const,
              overflowX: 'hidden' as const,
              position: 'relative' as const
            }}
          >
            <div className="auth-modal-header">
              <h2 className="auth-modal-title" style={{
                fontSize: isMobile ? '1.5rem' : '1.75rem'
              }}>Create Account</h2>
              <button
                onClick={closeModals}
                className="auth-modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRegister} className="auth-modal-content">
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}
              
              <div className="auth-input-group">
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={loading}
                />
                
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={loading}
                />
                
                {/* Indicador elegante de coincidencia de contraseñas */}
                {confirmPassword && password && (
                  <div className={`password-match-indicator ${password === confirmPassword ? 'match' : 'no-match'}`}>
                    <span className="password-match-icon">
                      {password === confirmPassword ? '✓' : '✗'}
                    </span>
                    {password === confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading || password !== confirmPassword}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-modal-footer">
              <p className="auth-switch-text">
                Already have an account?{' '}
                <button
                  onClick={openLoginModal}
                  className="auth-switch-button"
                  disabled={loading}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
