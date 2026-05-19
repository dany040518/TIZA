import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { validateInviteCode } from '@/lib/db';
import { Mark, Star, Blob } from '@/components/tiza/Mark';

type Step = 'code' | 'details' | 'success';
type Role = 'teacher' | 'coordinator';

export default function Register() {
  const [step, setStep]                       = useState<Step>('code');
  const [inviteCode, setInviteCode]           = useState('');
  const [institutionId, setInstitutionId]     = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [selectedRole, setSelectedRole]       = useState<Role>('teacher');
  const [fullName, setFullName]               = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(false);
  const navigate = useNavigate();

  const handleValidateCode = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setError('');
    setLoading(true);
    try {
      const result = await validateInviteCode(inviteCode.trim());
      if (!result.is_valid || !result.institution_id) {
        setError('Código inválido o expirado. Verifica con tu institución.');
        return;
      }
      setInstitutionId(result.institution_id);
      setInstitutionName(result.institution_name ?? '');
      setStep('details');
    } catch {
      setError('No se pudo validar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            invite_code: inviteCode.trim().toUpperCase(),
            role: selectedRole,
          },
        },
      });
      if (signUpError) throw signUpError;
      // data.session is null when email confirmation is required
      if (data.session) {
        navigate('/dashboard');
      } else {
        setStep('success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear la cuenta.';
      if (msg.includes('over_email_send_rate_limit') || msg.includes('rate_limit'))
        setError('Demasiados intentos. Espera unos minutos e intenta de nuevo.');
      else if (msg.includes('already registered') || msg.includes('User already registered'))
        setError('Ya existe una cuenta con ese correo. ¿Quieres iniciar sesión?');
      else
        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { n: '01', t: 'Seguro y privado',  s: 'Tus datos solo son tuyos.',        bg: 'var(--color-blush)'  },
    { n: '02', t: 'Acceso global',     s: 'Desde cualquier dispositivo.',     bg: 'var(--color-butter)' },
    { n: '03', t: 'Sin contratos',     s: 'Empieza gratis.',                  bg: 'var(--color-mint)'   },
    { n: '04', t: 'IA responsable',    s: 'Sugerimos. Tú decides siempre.',   bg: 'var(--color-lilac)'  },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ color: 'var(--color-plum)' }}>

      <Blob
        color="var(--color-butter)"
        className="absolute -z-10 pointer-events-none"
        style={{ top: -80, left: -80, width: 360, height: 360, transform: 'rotate(-20deg)', opacity: 0.65 }}
      />
      <Blob
        color="var(--color-lilac)"
        className="absolute -z-10 pointer-events-none"
        style={{ bottom: -120, right: -100, width: 380, height: 380, transform: 'rotate(15deg)', opacity: 0.55 }}
      />

      <header className="mx-auto max-w-[1200px] px-6 md:px-10 pt-8 flex items-center justify-between">
        <Mark to="/login" />
        <div className="flex items-center gap-4">
          <span className="label hidden md:block" style={{ color: 'var(--color-mute)' }}>Crear cuenta</span>
          <Link to="/login" className="btn-chunky" style={{ padding: '10px 18px', fontSize: 13 }}>
            Ya tengo cuenta →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 md:px-10 mt-12 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start pb-20">

        <section className="sticker sticker-lg p-8 md:p-12" style={{ background: 'var(--color-paper)' }}>
          <div className="flex items-center gap-3">
            <Star size={26} fill="var(--color-orange)" />
            <span className="label" style={{ color: 'var(--color-mute)' }}>bienvenido</span>
          </div>
          <h1 className="font-display mt-6 m-0" style={{ fontSize: 'clamp(36px, 5.5vw, 60px)' }}>
            Crea tu{' '}
            <span className="serif-em" style={{ color: 'var(--color-orange)' }}>espacio</span>.
          </h1>
          <p className="mt-4 text-[16px] font-medium" style={{ color: 'var(--color-mute)', lineHeight: 1.5 }}>
            {step === 'code'
              ? 'Ingresa el código de tu institución para comenzar.'
              : `Institución: ${institutionName}`}
          </p>

          {error && (
            <div
              className="sticker mt-6 p-4 text-[13px]"
              style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}
            >
              {error}
            </div>
          )}

          {/* ── Step 1: invite code ─────────────────────────── */}
          {step === 'code' && (
            <form onSubmit={handleValidateCode} className="mt-10 space-y-6">
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Código de institución</div>
                <input
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="TIZA2026"
                  className="w-full bg-transparent border-0 border-b py-2.5 text-[20px] font-bold tracking-widest focus:outline-none transition-colors"
                  style={{
                    borderColor: 'oklch(0.24 0.06 340 / 0.3)',
                    color: 'var(--color-plum)',
                  }}
                />
                <p className="mt-2 text-[12px] font-medium" style={{ color: 'var(--color-mute)' }}>
                  Pídele el código a tu coordinador o institución.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-chunky btn-chunky-primary w-full justify-center"
                  style={{ padding: '16px 24px', fontSize: 15 }}
                >
                  {loading ? (
                    <><span className="ink-pulse" />Verificando…</>
                  ) : (
                    <>Verificar código →</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 2: personal details ────────────────────── */}
          {step === 'details' && (
            <form onSubmit={handleRegister} className="mt-10 space-y-6">
              <div
                className="sticker p-4 flex items-center gap-3"
                style={{ background: 'var(--color-mint)' }}
              >
                <span style={{ color: 'var(--color-orange)', fontSize: 18 }}>✓</span>
                <span className="font-semibold text-[13px]">{institutionName}</span>
                <button
                  type="button"
                  className="ml-auto text-[12px]"
                  style={{ color: 'var(--color-mute)' }}
                  onClick={() => { setStep('code'); setError(''); }}
                >
                  Cambiar
                </button>
              </div>

              {/* Role selector */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Soy…</div>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: 'teacher',     label: 'Docente',      emoji: '✎', desc: 'Crea y gestiona planeaciones de clase' },
                    { value: 'coordinator', label: 'Coordinador',  emoji: '✦', desc: 'Revisa y aprueba planes de tu institución' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedRole(opt.value)}
                      className="sticker p-4 text-left transition-all"
                      style={{
                        background: selectedRole === opt.value ? 'var(--color-butter)' : 'var(--color-cream)',
                        borderWidth: selectedRole === opt.value ? 3 : 2,
                      }}
                    >
                      <div className="font-bold text-[15px] mb-1 flex items-center gap-2">
                        <span style={{ color: 'var(--color-orange)' }}>{opt.emoji}</span>
                        {opt.label}
                      </div>
                      <div className="text-[11px] font-medium" style={{ color: 'var(--color-mute)' }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Nombre completo</div>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Prof. Juana Pérez"
                  className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                />
              </div>

              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Correo electrónico</div>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juana@escuela.edu"
                  className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                />
              </div>

              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Contraseña</div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors pr-10"
                    style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 bottom-2.5 transition-colors hover:text-[color:var(--color-orange)]"
                    style={{ color: 'var(--color-mute)', background: 'none', border: 'none' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* hidden — used only to confirm institution in UI */}
              <input type="hidden" value={institutionId} />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-chunky btn-chunky-primary w-full justify-center"
                  style={{ padding: '16px 24px', fontSize: 15 }}
                >
                  {loading ? (
                    <><span className="ink-pulse" />Creando tu espacio…</>
                  ) : (
                    <>Crear cuenta →</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: success / confirm email ─────────────── */}
          {step === 'success' && (
            <div className="mt-10 space-y-6">
              <div
                className="sticker p-6"
                style={{ background: 'var(--color-mint)' }}
              >
                <div className="font-hand text-[28px] mb-2" style={{ color: 'var(--color-orange)' }}>
                  ¡Listo! ✿
                </div>
                <p className="font-semibold text-[16px] mb-1">Cuenta creada con éxito.</p>
                <p className="text-[13px]" style={{ color: 'var(--color-mute)' }}>
                  Te enviamos un correo de confirmación a{' '}
                  <strong>{email}</strong>.
                  Revisa tu bandeja de entrada (y el spam) para activar tu cuenta.
                </p>
              </div>
              <Link
                to="/login"
                className="btn-chunky btn-chunky-primary w-full justify-center no-underline"
                style={{ padding: '16px 24px', fontSize: 15, display: 'flex' }}
              >
                Ir a iniciar sesión →
              </Link>
            </div>
          )}

          {step !== 'success' && (
            <p className="mt-8 text-[13px] font-medium" style={{ color: 'var(--color-mute)' }}>
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-bold no-underline transition-colors hover:text-[color:var(--color-orange)]"
                style={{ color: 'var(--color-plum)' }}
              >
                Inicia sesión →
              </Link>
            </p>
          )}
        </section>

        <aside className="space-y-5 hidden lg:block">
          <div className="sticker p-7" style={{ background: 'var(--color-plum)', borderColor: 'var(--color-cream)' }}>
            <div className="font-hand mb-3" style={{ fontSize: 26, color: 'var(--color-butter)' }}>
              una promesa sencilla ✿
            </div>
            <p className="font-semibold text-[17px] leading-relaxed" style={{ color: 'var(--color-cream)' }}>
              Crea tu cuenta en menos de un minuto.{' '}
              <span className="serif-em" style={{ color: 'var(--color-blush)' }}>
                Todo en un espacio diseñado para docentes.
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.n} className="sticker p-5" style={{ background: f.bg }}>
                <div className="flex items-center gap-2 label mb-3" style={{ color: 'var(--color-orange)' }}>
                  <Star size={14} fill="var(--color-orange)" />
                  {f.n}
                </div>
                <div className="font-bold text-[15px] tracking-tight">{f.t}</div>
                <div className="text-[12px] font-medium mt-1.5" style={{ color: 'var(--color-mute)' }}>{f.s}</div>
              </div>
            ))}
          </div>
        </aside>

      </main>
    </div>
  );
}