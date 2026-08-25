'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./LoginComponent.css";
import { useError } from "@/hooks/useError";
import { useLoading } from "@/hooks/useLoading";
import bullcruxLogo from '@/images/icons/bullcrux-logo.svg';

const LoginComponent = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { error, setError } = useError();
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    startLoading();
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (response?.error) {
        setError("Invalid email or password");
        stopLoading();
        return;
      }

      setError(null);
      router.push('/');
      stopLoading();
    }
    catch (error) {
      console.error('Login error:', error);
      stopLoading();
    }
  }

  const handleGoogleLogin = async () => {
    startLoading()
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch (e) {
      setError("Error al iniciar sesión con Google")
      stopLoading()
    }
  }

  return (
    <div className="auth-split">
      {/* Columna izquierda: imagen */}
      <div className="auth-split__visual">
        <div className="auth-split__visual-logo" onClick={() => router.push('/')}>
          <Image src={bullcruxLogo} alt="BullCrux" width={112} height={32} />
        </div>
        <p className="auth-split__quote">
          Participá por premios reales. Comprá tu ticket o ganalo gratis.
        </p>
      </div>

      {/* Columna derecha: formulario */}
      <div className="auth-split__panel">
        <div className="auth-split__form">
          {isLoading ? (
            <p style={{ color: '#a0a3a7', textAlign: 'center' }}>Cargando...</p>
          ) : (
            <>
              <h1 className="auth-split__title">Iniciá sesión</h1>
              <p className="auth-split__subtitle">Entrá a tu cuenta para seguir participando</p>

              <form onSubmit={handleLogin} className="auth-split__fields">
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">Contraseña</label>
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="auth-split__forgot">
                  <a href="#">¿Olvidaste la contraseña?</a>
                </div>

                <button type="submit" className="auth-primary-btn">
                  Iniciar sesión
                </button>

                {error && <p className="auth-error">{error}</p>}
              </form>

              <div className="auth-split__divider">
                <span>O CONTINUÁ CON</span>
              </div>

              <div className="auth-split__social">
                <button type="button" className="auth-social-btn" onClick={handleGoogleLogin}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </div>

              <p className="auth-split__legal">
                Al continuar, aceptás nuestros <a href="/perfil/privacidad">Términos</a> y la <a href="/perfil/privacidad">Política de Privacidad</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginComponent
