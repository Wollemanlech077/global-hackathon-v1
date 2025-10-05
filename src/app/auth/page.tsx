'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

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
      console.error('Error signing in:', error)
      
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
      console.error('Error creating account:', error)
      
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
          errorMessage += 'La contraseña es muy débil'
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
      console.error('Error al cerrar sesión:', error)
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
      {/* Bottom Section */}
      {!showLoginModal && !showRegisterModal && (
        <div className="flex justify-center items-center pb-20">
          <div className="flex gap-4">
            <button className="portal-button" onClick={openLoginModal}>
              <span className="button-text">Sign In</span>
              <span className="arrow-circle">→</span>
            </button>
            
            <button className="portal-button" onClick={openRegisterModal}>
              <span className="button-text">Create Account</span>
              <span className="arrow-circle">+</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-32" 
          style={{ 
            zIndex: 9999,
            backdropFilter: 'blur(8px)'
          }}
          onClick={closeModals}
        >
          <div 
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal-header">
              <h2 className="auth-modal-title">Sign In</h2>
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
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-32" 
          style={{ 
            zIndex: 9999,
            backdropFilter: 'blur(8px)'
          }}
          onClick={closeModals}
        >
          <div 
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal-header">
              <h2 className="auth-modal-title">Create Account</h2>
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
                  minLength={6}
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
                  minLength={6}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
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
