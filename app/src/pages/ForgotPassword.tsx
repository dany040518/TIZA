import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Mark, Star, Blob } from '@/components/tiza/Mark';

type Step = 'request' | 'sent';

export default function ForgotPassword() {
  const [step, setStep]       = useState<Step>('request');
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setStep('sent');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('rate_limit') || msg.includes('over_email_send_rate_limit'))
        setError('Demasiados intentos. Espera unos minutos.');
      else
        setError('No se pudo enviar el correo. Verifica la dirección e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ color: 'var(--color-plum)' }}>

      <Blob
        color="var(--color-butter)"
        className="absolute -z-10 pointer-events-none"
        style={{ top: -80, right: -80, width: 360, height: 360, transform: 'rotate(15deg)', opacity: 0.6 }}
      />
      <Blob
        color="var(--color-lilac)"
        className="absolute -z-10 pointer-events-none"
        style={{ bottom: -120, left: -100, width: 360, height: 360, transform: 'rotate(-20deg)', opacity: 0.5 }}
      />

      <header className="mx-auto max-w-[600px] px-6 pt-8 flex items-center justify-between">
        <Mark to="/login" />
        <Link to="/login" className="btn-chunky" style={{ padding: '10px 18px', fontSize: 13 }}>
          <ArrowLeft size={13} />
          Volver
        </Link>
      </header>

      <main className="mx-auto max-w-[600px] px-6 mt-12 pb-20">
        <div className="sticker sticker-lg p-8 md:p-12" style={{ background: 'var(--color-paper)' }}>

          <div className="flex items-center gap-3">
            <Star size={26} fill="var(--color-orange)" />
            <span className="label" style={{ color: 'var(--color-mute)' }}>recuperar acceso</span>
          </div>

          <h1 className="font-display mt-6 m-0" style={{ fontSize: 'clamp(30px, 5vw, 48px)' }}>
            Restablece tu{' '}
            <span className="serif-em" style={{ color: 'var(--color-orange)' }}>contraseña</span>.
          </h1>

          {/* ── Step 1: request email ────────────────────────── */}
          {step === 'request' && (
            <>
              <p className="mt-4 text-[15px] font-medium" style={{ color: 'var(--color-mute)', lineHeight: 1.5 }}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              {error && (
                <div
                  className="sticker mt-6 p-4 text-[13px]"
                  style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleRequest} className="mt-8 space-y-6">
                <div>
                  <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Correo electrónico</div>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-0 bottom-3 pointer-events-none"
                      style={{ color: 'var(--color-mute)' }}
                    />
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="valentina@escuela.edu"
                      className="w-full bg-transparent border-0 border-b py-2.5 pl-6 text-[17px] focus:outline-none transition-colors"
                      style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-chunky btn-chunky-primary w-full justify-center"
                    style={{ padding: '16px 24px', fontSize: 15 }}
                  >
                    {loading ? <><span className="ink-pulse" />Enviando…</> : <>Enviar enlace de recuperación →</>}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── Step 2: confirmation ─────────────────────────── */}
          {step === 'sent' && (
            <div className="mt-8 space-y-6">
              <div
                className="sticker p-6 flex items-start gap-4"
                style={{ background: 'var(--color-mint)' }}
              >
                <CheckCircle size={24} style={{ color: 'oklch(0.4 0.12 145)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="font-bold text-[16px] mb-1">Correo enviado</div>
                  <p className="text-[13px] font-medium" style={{ color: 'var(--color-mute)', lineHeight: 1.5 }}>
                    Enviamos un enlace de recuperación a <strong>{email}</strong>.<br />
                    Revisa tu bandeja de entrada y el spam. El enlace expira en 30 minutos.
                  </p>
                </div>
              </div>

              <div className="sticker p-5" style={{ background: 'var(--color-butter)' }}>
                <div className="font-semibold text-[13px] mb-1">Pasos siguientes:</div>
                <ol className="space-y-1 text-[13px]" style={{ color: 'var(--color-mute)', paddingLeft: '1.2em' }}>
                  <li>1. Abre el correo de TIZA</li>
                  <li>2. Haz clic en "Restablecer contraseña"</li>
                  <li>3. Escribe tu nueva contraseña</li>
                  <li>4. Inicia sesión normalmente</li>
                </ol>
              </div>

              <button
                onClick={() => { setStep('request'); setEmail(''); }}
                className="btn-chunky w-full justify-center"
                style={{ padding: '14px 24px', fontSize: 14 }}
              >
                Enviar a otro correo
              </button>
            </div>
          )}

          <p className="mt-8 text-[13px] font-medium" style={{ color: 'var(--color-mute)' }}>
            ¿Recordaste tu contraseña?{' '}
            <Link
              to="/login"
              className="font-bold no-underline transition-colors hover:text-[color:var(--color-orange)]"
              style={{ color: 'var(--color-plum)' }}
            >
              Inicia sesión →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}