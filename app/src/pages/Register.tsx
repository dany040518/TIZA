import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { upsertProfile } from '@/lib/db';
import { Mark, Star, Blob } from '@/components/tiza/Mark';

export default function Register() {
  const [fullName, setFullName]       = useState('');
  const [institution, setInstitution] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, institution } },
      });
      if (signUpError) throw signUpError;

      if (data.user) {
        await upsertProfile({
          id: data.user.id,
          name: fullName,
          institution,
          email,
          role: 'teacher',
        });
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { n: '01', t: 'Seguro y privado',  s: 'Tus datos solo son tuyos.',        bg: 'var(--color-blush)'  },
    { n: '02', t: 'Acceso global',     s: 'Desde cualquier dispositivo.',     bg: 'var(--color-butter)' },
    { n: '03', t: 'Sin contratos',     s: 'Empieza gratis.',                  bg: 'var(--color-mint)'   },
    { n: '04', t: 'IA responsable',    s: 'Sugerimos. Tú decides siempre.',   bg: 'var(--color-lilac)'  },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ color: 'var(--color-plum)' }}>

      {/* Decorative blobs */}
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

      {/* Header */}
      <header className="mx-auto max-w-[1200px] px-6 md:px-10 pt-8 flex items-center justify-between">
        <Mark to="/login" />
        <div className="flex items-center gap-4">
          <span className="label hidden md:block" style={{ color: 'var(--color-mute)' }}>Crear cuenta</span>
          <Link
            to="/login"
            className="btn-chunky"
            style={{ padding: '10px 18px', fontSize: 13 }}
          >
            Ya tengo cuenta →
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-[1200px] px-6 md:px-10 mt-12 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start pb-20">

        {/* Left: form card */}
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
            Únete a la comunidad de educadores modernos.
          </p>

          <form onSubmit={handleRegister} className="mt-10 space-y-6">
            {error && (
              <div
                className="sticker p-4 text-[13px]"
                style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}
              >
                {error}
              </div>
            )}

            <div>
              <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Nombre completo</div>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Prof. Juana Pérez"
                className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors"
                style={{
                  borderColor: 'oklch(0.24 0.06 340 / 0.3)',
                  color: 'var(--color-plum)',
                }}
              />
            </div>

            <div>
              <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Institución educativa</div>
              <input
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Colegio San José"
                className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors"
                style={{
                  borderColor: 'oklch(0.24 0.06 340 / 0.3)',
                  color: 'var(--color-plum)',
                }}
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
                style={{
                  borderColor: 'oklch(0.24 0.06 340 / 0.3)',
                  color: 'var(--color-plum)',
                }}
              />
            </div>

            <div>
              <div className="label mb-2" style={{ color: 'var(--color-mute)' }}>Contraseña</div>
              <input
                required
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-transparent border-0 border-b py-2.5 text-[17px] focus:outline-none transition-colors"
                style={{
                  borderColor: 'oklch(0.24 0.06 340 / 0.3)',
                  color: 'var(--color-plum)',
                }}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-chunky btn-chunky-primary w-full justify-center"
                style={{ padding: '16px 24px', fontSize: 15 }}
              >
                {loading ? (
                  <>
                    <span className="ink-pulse" />
                    Creando tu espacio…
                  </>
                ) : (
                  <>Crear cuenta →</>
                )}
              </button>
            </div>
          </form>

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
        </section>

        {/* Right: feature cards */}
        <aside className="space-y-5 hidden lg:block">
          {/* Promise note */}
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

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3">
            {steps.map((f) => (
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