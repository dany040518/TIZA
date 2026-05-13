import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Mark, Star, Blob } from '@/components/tiza/Mark';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.BaseSyntheticEvent) => {
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
    <div className="min-h-screen relative overflow-hidden" style={{ color: 'var(--color-plum)' }}>

      {/* Decorative blobs */}
      <Blob
        color="var(--color-blush)"
        className="absolute -z-10 pointer-events-none"
        style={{ top: -80, right: -80, width: 380, height: 380, transform: 'rotate(20deg)', opacity: 0.7 }}
      />
      <Blob
        color="var(--color-mint)"
        className="absolute -z-10 pointer-events-none"
        style={{ bottom: -120, left: -100, width: 360, height: 360, transform: 'rotate(-15deg)', opacity: 0.6 }}
      />

      {/* Header */}
      <header className="mx-auto max-w-[1200px] px-6 md:px-10 pt-8 flex items-center justify-between">
        <Mark to="/login" />
        <div className="flex items-center gap-4">
          <span className="label hidden md:block" style={{ color: 'var(--color-mute)' }}>Acceso seguro</span>
          <Link
            to="/register"
            className="btn-chunky btn-chunky-butter"
            style={{ padding: '10px 18px', fontSize: 13 }}
          >
            Crear cuenta →
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-[1200px] px-6 md:px-10 mt-12 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start pb-20">

        {/* Left: form card */}
        <section className="sticker sticker-lg p-8 md:p-12" style={{ background: 'var(--color-paper)' }}>
          <div className="flex items-center gap-3">
            <Star size={26} fill="var(--color-orange)" />
            <span className="label" style={{ color: 'var(--color-mute)' }}>bienvenido de vuelta</span>
          </div>
          <h1 className="font-display mt-6 m-0" style={{ fontSize: 'clamp(36px, 5.5vw, 60px)' }}>
            Entra a tu{' '}
            <span className="serif-em" style={{ color: 'var(--color-orange)' }}>espacio</span>.
          </h1>
          <p className="mt-4 text-[16px] font-medium" style={{ color: 'var(--color-mute)', lineHeight: 1.5 }}>
            Diseñado para el ritmo real de los educadores.
          </p>

          <form onSubmit={handleLogin} className="mt-10 space-y-6">
            {error && (
              <div
                className="sticker p-4 text-[13px]"
                style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}
              >
                {error}
              </div>
            )}

            <div>
              <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Correo electrónico</div>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="valentina@escuela.edu"
                className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors"
                style={{
                  borderColor: 'oklch(0.24 0.06 340 / 0.3)',
                  color: 'var(--color-plum)',
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="label" style={{ color: 'var(--color-mute)' }}>Contraseña</div>
                <button
                  type="button"
                  className="text-[11px] font-semibold transition-colors hover:text-[color:var(--color-orange)]"
                  style={{ color: 'var(--color-mute)' }}
                >
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
                className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors"
                style={{
                  borderColor: 'oklch(0.24 0.06 340 / 0.3)',
                  color: 'var(--color-plum)',
                }}
              />
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-chunky btn-chunky-primary w-full justify-center"
                style={{ padding: '16px 24px', fontSize: 15 }}
              >
                {loading ? (
                  <>
                    <span className="ink-pulse" />
                    Entrando…
                  </>
                ) : (
                  <>Iniciar sesión →</>
                )}
              </button>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px" style={{ background: 'oklch(0.24 0.06 340 / 0.15)' }} />
                <span className="label" style={{ color: 'var(--color-mute)' }}>o</span>
                <div className="flex-1 h-px" style={{ background: 'oklch(0.24 0.06 340 / 0.15)' }} />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn-chunky w-full justify-center"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                Continuar con Google
              </button>
            </div>
          </form>

          <p className="mt-8 text-[13px] font-medium" style={{ color: 'var(--color-mute)' }}>
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-bold no-underline transition-colors hover:text-[color:var(--color-orange)]"
              style={{ color: 'var(--color-plum)' }}
            >
              Regístrate gratis →
            </Link>
          </p>
        </section>

        {/* Right: info sidebar */}
        <aside className="space-y-5 hidden lg:block">
          {/* Testimonial */}
          <div className="sticker p-7" style={{ background: 'var(--color-blush)' }}>
            <div className="font-hand mb-3" style={{ fontSize: 26, color: 'var(--color-orange)' }}>
              testimonio ✿
            </div>
            <p className="serif-em text-[18px]" style={{ lineHeight: 1.6, color: 'var(--color-plum)' }}>
              "Lo que antes me tomaba horas, ahora lo hago en minutos con una calidad superior."
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span
                className="rounded-full font-bold text-[14px] flex items-center justify-center shrink-0"
                style={{
                  width: 36, height: 36,
                  background: 'var(--color-butter)',
                  border: '2px solid var(--color-plum)',
                }}
              >
                E
              </span>
              <div>
                <div className="font-semibold text-[13px]">Dra. Elena Martínez</div>
                <div className="text-[11px]" style={{ color: 'var(--color-mute)' }}>Profesora de Ciencias</div>
              </div>
            </div>
          </div>

          {/* Promise note */}
          <div className="sticker p-7" style={{ background: 'var(--color-plum)', borderColor: 'var(--color-cream)' }}>
            <div className="font-hand mb-3" style={{ fontSize: 26, color: 'var(--color-butter)' }}>
              de tiza ✿
            </div>
            <p className="font-semibold text-[17px] leading-relaxed" style={{ color: 'var(--color-cream)' }}>
              TIZA no automatiza la enseñanza.{' '}
              <span className="serif-em" style={{ color: 'var(--color-blush)' }}>
                Protege el humano en el docente.
              </span>
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Seguro y privado', bg: 'var(--color-mint)' },
              { label: 'Sin contratos',    bg: 'var(--color-butter)' },
              { label: 'IA responsable',   bg: 'var(--color-blush)' },
              { label: 'Acceso global',    bg: 'var(--color-lilac)' },
            ].map((f) => (
              <span key={f.label} className="chip" style={{ background: f.bg }}>
                {f.label}
              </span>
            ))}
          </div>
        </aside>

      </main>
    </div>
  );
}