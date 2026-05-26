import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Mark, Star } from '@/components/tiza/Mark';

export default function ResetPassword() {
  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [done, setDone]                 = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  // Supabase redirects here with tokens in the URL hash;
  // it auto-processes them and sets a session.
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setSessionReady(true);
    });
    // Also check if session already exists (token auto-consumed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });
  }, []);

  const handleReset = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ color: 'var(--color-plum)' }}>
      <header className="mx-auto max-w-[600px] px-6 pt-8">
        <Mark to="/login" />
      </header>

      <main className="mx-auto max-w-[600px] px-6 mt-12 pb-20">
        <div className="sticker sticker-lg p-8 md:p-12" style={{ background: 'var(--color-paper)' }}>

          <div className="flex items-center gap-3">
            <Star size={26} fill="var(--color-orange)" />
            <span className="label" style={{ color: 'var(--color-mute)' }}>nueva contraseña</span>
          </div>

          <h1 className="font-display mt-6 m-0" style={{ fontSize: 'clamp(28px, 5vw, 44px)' }}>
            Crea una contraseña{' '}
            <span className="serif-em" style={{ color: 'var(--color-orange)' }}>segura</span>.
          </h1>

          {done ? (
            <div className="mt-8 sticker p-6 flex items-start gap-4" style={{ background: 'var(--color-mint)' }}>
              <CheckCircle size={24} style={{ color: 'oklch(0.4 0.12 145)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="font-bold text-[16px] mb-1">¡Contraseña actualizada!</div>
                <p className="text-[13px]" style={{ color: 'var(--color-mute)' }}>
                  Redirigiendo al inicio de sesión…
                </p>
              </div>
            </div>
          ) : !sessionReady ? (
            <div className="mt-8 sticker p-6" style={{ background: 'var(--color-butter)' }}>
              <p className="font-semibold text-[14px]">Verificando enlace…</p>
              <p className="text-[13px] mt-1" style={{ color: 'var(--color-mute)' }}>
                Si llegaste aquí desde un enlace expirado,{' '}
                <Link to="/forgot-password" style={{ color: 'var(--color-orange)' }}>
                  solicita uno nuevo
                </Link>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="mt-8 space-y-6">
              {error && (
                <div
                  className="sticker p-4 text-[13px]"
                  style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}
                >
                  {error}
                </div>
              )}

              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Nueva contraseña</div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors pr-10"
                    style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 bottom-2.5"
                    style={{ color: 'var(--color-mute)', background: 'none', border: 'none' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Confirmar contraseña</div>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-chunky btn-chunky-primary w-full justify-center"
                  style={{ padding: '16px 24px', fontSize: 15 }}
                >
                  {loading ? <><span className="ink-pulse" />Guardando…</> : <>Guardar nueva contraseña →</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}