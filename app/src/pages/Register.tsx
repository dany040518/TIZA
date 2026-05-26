import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { validateInviteCode } from '@/lib/db';
import { Mark, Star, Blob } from '@/components/tiza/Mark';

type Step = 'code' | 'details' | 'success';

const DIAL_CODES = [
  { code: '+57',  flag: '🇨🇴', name: 'Colombia'         },
  { code: '+1',   flag: '🇺🇸', name: 'EE.UU. / Canadá'  },
  { code: '+52',  flag: '🇲🇽', name: 'México'            },
  { code: '+54',  flag: '🇦🇷', name: 'Argentina'         },
  { code: '+55',  flag: '🇧🇷', name: 'Brasil'            },
  { code: '+51',  flag: '🇵🇪', name: 'Perú'              },
  { code: '+56',  flag: '🇨🇱', name: 'Chile'             },
  { code: '+58',  flag: '🇻🇪', name: 'Venezuela'         },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador'           },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia'           },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay'          },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay'           },
  { code: '+507', flag: '🇵🇦', name: 'Panamá'            },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica'        },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala'         },
  { code: '+504', flag: '🇭🇳', name: 'Honduras'          },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador'       },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua'         },
  { code: '+53',  flag: '🇨🇺', name: 'Cuba'              },
  { code: '+34',  flag: '🇪🇸', name: 'España'            },
];

interface PwdCheck {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

function checkPassword(pwd: string): PwdCheck {
  return {
    length:    pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    number:    /\d/.test(pwd),
    special:   /[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?`~]/.test(pwd),
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function isValidName(name: string) {
  return name.trim().length >= 3 && !/\d/.test(name);
}

const PWD_RULES: { key: keyof PwdCheck; label: string }[] = [
  { key: 'length',    label: 'Mínimo 8 caracteres'          },
  { key: 'uppercase', label: 'Al menos una letra mayúscula' },
  { key: 'number',    label: 'Al menos un número'           },
  { key: 'special',   label: 'Al menos un carácter especial (!@#$…)' },
];

export default function Register() {
  const [step, setStep]                       = useState<Step>('code');
  const [inviteCode, setInviteCode]           = useState('');
  const [institutionId, setInstitutionId]     = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [codeRole, setCodeRole]               = useState<'teacher' | 'coordinator'>('teacher');

  // details fields
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [dialCode, setDialCode]       = useState('+57');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // inline validation errors
  const [nameError, setNameError]   = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pwdCheck = checkPassword(password);
  const pwdValid = Object.values(pwdCheck).every(Boolean);

  // ── Step 1 ───────────────────────────────────────────────
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
      setCodeRole((result.role as 'teacher' | 'coordinator') ?? 'teacher');
      setStep('details');
    } catch {
      setError('No se pudo validar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 ───────────────────────────────────────────────
  const handleRegister = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    let hasError = false;

    if (!isValidName(fullName)) {
      setNameError('El nombre debe tener al menos 3 letras y no contener números.');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!isValidEmail(email)) {
      setEmailError('Ingresa un correo electrónico válido (ej. nombre@escuela.edu).');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (phoneNumber && phoneNumber.length < 7) {
      setPhoneError('El número debe tener al menos 7 dígitos.');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (!pwdValid) {
      setError('La contraseña no cumple con todos los requisitos de seguridad.');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    const phone = phoneNumber.trim() ? `${dialCode} ${phoneNumber.trim()}` : null;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name:   fullName.trim(),
            invite_code: inviteCode.trim().toUpperCase(),
            role:        codeRole,
            phone,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Try to persist phone to app_users (trigger may create the row async)
      if (data.user && phone) {
        await supabase.from('app_users').update({ phone }).eq('id', data.user.id);
      }

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
      else if (msg.includes('invalid'))
        setError('El correo electrónico no es válido.');
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

  const inputBase = 'w-full bg-transparent border-0 border-b py-2.5 text-[16px] sm:text-[17px] focus:outline-none transition-colors';
  const inputStyle = { borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ color: 'var(--color-plum)' }}>

      <Blob
        color="var(--color-butter)"
        className="absolute -z-10 pointer-events-none"
        style={{ top: -80, left: -80, width: 320, height: 320, transform: 'rotate(-20deg)', opacity: 0.65 }}
      />
      <Blob
        color="var(--color-lilac)"
        className="absolute -z-10 pointer-events-none"
        style={{ bottom: -120, right: -100, width: 340, height: 340, transform: 'rotate(15deg)', opacity: 0.55 }}
      />

      <header className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 flex items-center justify-between">
        <Mark to="/login" />
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="label hidden md:block" style={{ color: 'var(--color-mute)' }}>Crear cuenta</span>
          <Link to="/login" className="btn-chunky" style={{ padding: '8px 14px', fontSize: 12 }}>
            <span className="hidden sm:inline">Ya tengo cuenta</span>
            <span className="sm:hidden">Ingresar</span>
            {' →'}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-start pb-16 sm:pb-20">

        <section className="sticker p-5 sm:p-8 md:p-12" style={{ background: 'var(--color-paper)' }}>
          <div className="flex items-center gap-3">
            <Star size={22} fill="var(--color-orange)" />
            <span className="label" style={{ color: 'var(--color-mute)' }}>bienvenido</span>
          </div>
          <h1 className="font-display mt-4 sm:mt-6 m-0" style={{ fontSize: 'clamp(30px, 5.5vw, 60px)' }}>
            Crea tu{' '}
            <span className="serif-em" style={{ color: 'var(--color-orange)' }}>espacio</span>.
          </h1>
          <p className="mt-3 text-[14px] sm:text-[16px] font-medium" style={{ color: 'var(--color-mute)', lineHeight: 1.5 }}>
            {step === 'code'
              ? 'Ingresa el código de tu institución para comenzar.'
              : `Institución: ${institutionName}`}
          </p>

          {error && (
            <div
              className="sticker mt-5 p-3 sm:p-4 text-[13px]"
              style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}
            >
              {error}
            </div>
          )}

          {/* ── Step 1: invite code ─────────────────────────── */}
          {step === 'code' && (
            <form onSubmit={handleValidateCode} className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Código de institución</div>
                <input
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="TIZA2026"
                  className="w-full bg-transparent border-0 border-b py-2.5 text-[18px] sm:text-[20px] font-bold tracking-widest focus:outline-none transition-colors"
                  style={inputStyle}
                />
                <p className="mt-2 text-[12px] font-medium" style={{ color: 'var(--color-mute)' }}>
                  Pídele el código a tu coordinador o institución.
                </p>
              </div>
              <div className="pt-1 sm:pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-chunky btn-chunky-primary w-full justify-center"
                  style={{ padding: '14px 24px', fontSize: 14 }}
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
            <form onSubmit={handleRegister} className="mt-8 sm:mt-10 space-y-5 sm:space-y-6" noValidate>

              {/* Institution chip */}
              <div
                className="sticker p-3 sm:p-4 flex items-center gap-3"
                style={{ background: 'var(--color-mint)' }}
              >
                <span style={{ color: 'var(--color-orange)', fontSize: 18 }}>✓</span>
                <span className="font-semibold text-[13px] truncate">{institutionName}</span>
                <button
                  type="button"
                  className="ml-auto text-[12px] shrink-0"
                  style={{ color: 'var(--color-mute)' }}
                  onClick={() => { setStep('code'); setError(''); }}
                >
                  Cambiar
                </button>
              </div>

              {/* Role badge */}
              <div
                className="sticker p-3 flex items-center gap-3"
                style={{ background: codeRole === 'coordinator' ? 'var(--color-lilac)' : 'var(--color-butter)' }}
              >
                <span style={{ color: 'var(--color-orange)', fontSize: 16 }}>
                  {codeRole === 'coordinator' ? '✦' : '✎'}
                </span>
                <div>
                  <div className="font-bold text-[13px]">
                    {codeRole === 'coordinator' ? 'Coordinador' : 'Docente'}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--color-mute)' }}>
                    Rol asignado por tu código de acceso
                  </div>
                </div>
              </div>

              {/* Full name */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Nombre completo</div>
                <input
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); if (nameError) setNameError(''); }}
                  onBlur={() => {
                    if (fullName && !isValidName(fullName))
                      setNameError('El nombre debe tener al menos 3 letras y no contener números.');
                    else setNameError('');
                  }}
                  placeholder="Prof. Juana Pérez"
                  className={inputBase}
                  style={inputStyle}
                />
                {nameError && (
                  <p className="mt-1.5 text-[12px] font-medium flex items-center gap-1" style={{ color: 'oklch(0.55 0.18 25)' }}>
                    <X size={11} /> {nameError}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Correo electrónico</div>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                  onBlur={() => {
                    if (email && !isValidEmail(email))
                      setEmailError('Ingresa un correo válido (ej. nombre@escuela.edu).');
                    else setEmailError('');
                  }}
                  placeholder="juana@escuela.edu"
                  className={inputBase}
                  style={inputStyle}
                />
                {emailError && (
                  <p className="mt-1.5 text-[12px] font-medium flex items-center gap-1" style={{ color: 'oklch(0.55 0.18 25)' }}>
                    <X size={11} /> {emailError}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>
                  Teléfono <span className="font-normal">(opcional)</span>
                </div>
                <div className="flex gap-0 border-b" style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}>
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className="shrink-0 bg-transparent border-0 py-2.5 text-[15px] sm:text-[16px] focus:outline-none cursor-pointer pr-1"
                    style={{ color: 'var(--color-plum)', maxWidth: 110 }}
                  >
                    {DIAL_CODES.map((d) => (
                      <option key={`${d.code}-${d.name}`} value={d.code}>
                        {d.flag} {d.code} {d.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''));
                      if (phoneError) setPhoneError('');
                    }}
                    onBlur={() => {
                      if (phoneNumber && phoneNumber.length < 7)
                        setPhoneError('El número debe tener al menos 7 dígitos.');
                      else setPhoneError('');
                    }}
                    placeholder="3225092615"
                    maxLength={15}
                    className="flex-1 bg-transparent border-0 py-2.5 text-[16px] sm:text-[17px] focus:outline-none pl-2"
                    style={{ color: 'var(--color-plum)' }}
                  />
                </div>
                {phoneError && (
                  <p className="mt-1.5 text-[12px] font-medium flex items-center gap-1" style={{ color: 'oklch(0.55 0.18 25)' }}>
                    <X size={11} /> {phoneError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Contraseña</div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputBase} pr-10`}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 bottom-2.5 transition-opacity hover:opacity-60"
                    style={{ color: 'var(--color-mute)', background: 'none', border: 'none' }}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength checklist */}
                {password.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {PWD_RULES.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-1.5 text-[12px]">
                        {pwdCheck[key]
                          ? <Check size={12} style={{ color: 'var(--color-orange)', flexShrink: 0 }} />
                          : <X size={12} style={{ color: 'var(--color-mute)', flexShrink: 0 }} />
                        }
                        <span style={{ color: pwdCheck[key] ? 'var(--color-plum)' : 'var(--color-mute)' }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-3 flex gap-1">
                    {[0, 1, 2, 3].map((i) => {
                      const filled = Object.values(pwdCheck).filter(Boolean).length > i;
                      const allDone = pwdValid;
                      return (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all"
                          style={{
                            background: filled
                              ? allDone
                                ? 'var(--color-orange)'
                                : 'oklch(0.75 0.10 60)'
                              : 'oklch(0.24 0.06 340 / 0.15)',
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <input type="hidden" value={institutionId} />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-chunky btn-chunky-primary w-full justify-center"
                  style={{ padding: '14px 24px', fontSize: 14 }}
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
            <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
              <div className="sticker p-5 sm:p-6" style={{ background: 'var(--color-mint)' }}>
                <div className="font-hand text-[26px] sm:text-[28px] mb-2" style={{ color: 'var(--color-orange)' }}>
                  ¡Listo! ✿
                </div>
                <p className="font-semibold text-[15px] sm:text-[16px] mb-1">Cuenta creada con éxito.</p>
                <p className="text-[13px]" style={{ color: 'var(--color-mute)' }}>
                  Te enviamos un correo de confirmación a{' '}
                  <strong>{email}</strong>.
                  Revisa tu bandeja de entrada (y el spam) para activar tu cuenta.
                </p>
              </div>
              <Link
                to="/login"
                className="btn-chunky btn-chunky-primary w-full justify-center no-underline"
                style={{ padding: '14px 24px', fontSize: 14, display: 'flex' }}
              >
                Ir a iniciar sesión →
              </Link>
            </div>
          )}

          {step !== 'success' && (
            <p className="mt-6 sm:mt-8 text-[13px] font-medium" style={{ color: 'var(--color-mute)' }}>
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

        {/* ── Aside ───────────────────────────────────────────── */}
        <aside className="space-y-4 sm:space-y-5">
          <div className="sticker p-5 sm:p-7" style={{ background: 'var(--color-plum)', borderColor: 'var(--color-cream)' }}>
            <div className="font-hand mb-3" style={{ fontSize: 22, color: 'var(--color-butter)' }}>
              una promesa sencilla ✿
            </div>
            <p className="font-semibold text-[15px] sm:text-[17px] leading-relaxed" style={{ color: 'var(--color-cream)' }}>
              Crea tu cuenta en menos de un minuto.{' '}
              <span className="serif-em" style={{ color: 'var(--color-blush)' }}>
                Todo en un espacio diseñado para docentes.
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.n} className="sticker p-4 sm:p-5" style={{ background: f.bg }}>
                <div className="flex items-center gap-2 label mb-2 sm:mb-3" style={{ color: 'var(--color-orange)' }}>
                  <Star size={13} fill="var(--color-orange)" />
                  {f.n}
                </div>
                <div className="font-bold text-[13px] sm:text-[15px] tracking-tight">{f.t}</div>
                <div className="text-[11px] sm:text-[12px] font-medium mt-1.5" style={{ color: 'var(--color-mute)' }}>{f.s}</div>
              </div>
            ))}
          </div>
        </aside>

      </main>
    </div>
  );
}