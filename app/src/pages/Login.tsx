import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Mark } from '@/components/tiza/Mark';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="dawn-light" />

      {/* Header */}
      <header className="relative px-10 py-6 flex items-center justify-between border-b border-line">
        <Mark to="/login" />
        <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
          <span>Acceso seguro</span>
          <Link to="/register" className="text-ink hover:text-orange transition-colors">
            Crear cuenta
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main className="relative flex min-h-[calc(100vh-73px)]">

        {/* Left — editorial */}
        <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 border-r border-line p-12">
          <div />
          <div>
            <div className="eyebrow mb-8">— Un espacio, no un dashboard</div>
            <p className="font-serif font-light text-[36px] leading-[1.15] tracking-[-0.015em]">
              Diseñado para el ritmo real de los educadores.
            </p>
            <p className="mt-6 text-[14px] text-mute leading-relaxed max-w-[340px]">
              TIZA no automatiza la enseñanza. Protege <em className="italic text-ink not-italic">el humano en el docente</em> — manejando el resto en silencio.
            </p>
          </div>

          <div className="p-5 bg-blush-mist/60 border border-blush-air">
            <p className="font-serif italic text-[15px] leading-relaxed text-mute font-light">
              "Lo que antes me tomaba horas, ahora lo hago en minutos con una calidad superior."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blush flex items-center justify-center font-serif text-[13px]">E</div>
              <div>
                <div className="text-[12.5px] text-ink">Dra. Elena Martínez</div>
                <div className="text-[11px] text-mute">Profesora de Ciencias</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 max-w-[560px] mx-auto lg:mx-0">
          <div className="eyebrow mb-6">— Bienvenido de vuelta</div>
          <h1 className="font-serif font-light text-[44px] leading-[1.05] tracking-[-0.02em] mb-8">
            Entra a tu{' '}
            <span className="italic text-orange">espacio</span>
            <span className="text-orange">.</span>
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">

            {error && (
              <div className="p-3 border border-destructive/30 bg-destructive/5 text-[13px] text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="eyebrow block mb-2">Correo electrónico</label>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="valentina@escuela.edu"
                className="w-full bg-transparent border-0 border-b border-line py-2.5 text-[17px] font-serif focus:outline-none focus:border-orange transition-colors placeholder:text-mute-soft"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="eyebrow">Contraseña</label>
                <button type="button" className="text-[11px] text-mute hover:text-orange transition-colors">
                  ¿Olvidaste la contraseña?
                </button>
              </div>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-line py-2.5 text-[17px] font-serif focus:outline-none focus:border-orange transition-colors placeholder:text-mute-soft"
              />
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-paper py-3.5 text-[14px] hover:bg-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <>
                    <span className="ink-pulse" />
                    Entrando…
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <span className="heart" style={{ background: '#FAFAFA' }} />
                  </>
                )}
              </button>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-line" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">o</span>
                <div className="flex-1 h-px bg-line" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full border border-line text-ink py-3 text-[13.5px] hover:border-mute transition-colors flex items-center justify-center gap-2.5"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                Continuar con Google
              </button>
            </div>
          </form>

          <p className="mt-8 text-[13px] text-mute">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-ink hover:text-orange transition-colors underline underline-offset-4 decoration-line">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
