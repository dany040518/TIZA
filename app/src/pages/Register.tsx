import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { upsertProfile } from '@/lib/db';
import { Mark } from '@/components/tiza/Mark';

export default function Register() {
  const [fullName, setFullName]       = useState('');
  const [institution, setInstitution] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="dawn-light" />

      {/* Header */}
      <header className="relative px-10 py-6 flex items-center justify-between border-b border-line">
        <Mark to="/login" />
        <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
          <span>Crear cuenta</span>
          <Link to="/login" className="text-ink hover:text-orange transition-colors">
            Ya tengo cuenta
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main className="relative flex min-h-[calc(100vh-73px)]">

        {/* Left — editorial */}
        <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 border-r border-line p-12">
          <div />
          <div>
            <div className="eyebrow mb-8">— Una promesa sencilla</div>
            <p className="font-serif font-light text-[36px] leading-[1.15] tracking-[-0.015em]">
              Únete a la comunidad de educadores modernos.
            </p>
            <p className="mt-6 text-[14px] text-mute leading-relaxed max-w-[340px]">
              Crea tu cuenta en menos de un minuto. Planeaciones de clase, seguimiento de grupos y mucho más — todo en un espacio diseñado para docentes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { n: '01', t: 'Seguro y privado', s: 'Tus datos solo son tuyos.' },
              { n: '02', t: 'Acceso global',    s: 'Desde cualquier dispositivo.' },
              { n: '03', t: 'Sin contratos',    s: 'Empieza gratis.' },
              { n: '04', t: 'IA responsable',   s: 'Sugerimos. Tú decides siempre.' },
            ].map((f) => (
              <div key={f.n} className="border border-line p-4 bg-paper">
                <div className="font-mono text-[10px] text-orange tracking-widest mb-2">{f.n}</div>
                <div className="font-serif text-[15px]">{f.t}</div>
                <div className="text-[11.5px] text-mute mt-1">{f.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 max-w-[560px] mx-auto lg:mx-0">
          <div className="eyebrow mb-6">— Bienvenido</div>
          <h1 className="font-serif font-light text-[44px] leading-[1.05] tracking-[-0.02em] mb-8">
            Crea tu{' '}
            <span className="italic text-orange">espacio</span>
            <span className="text-orange">.</span>
          </h1>

          <form onSubmit={handleRegister} className="space-y-6">

            {error && (
              <div className="p-3 border border-destructive/30 bg-destructive/5 text-[13px] text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="eyebrow block mb-2">Nombre completo</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Prof. Juana Pérez"
                className="w-full bg-transparent border-0 border-b border-line py-2.5 text-[17px] font-serif focus:outline-none focus:border-orange transition-colors placeholder:text-mute-soft"
              />
            </div>

            <div>
              <label className="eyebrow block mb-2">Institución educativa</label>
              <input
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Colegio San José"
                className="w-full bg-transparent border-0 border-b border-line py-2.5 text-[17px] font-serif focus:outline-none focus:border-orange transition-colors placeholder:text-mute-soft"
              />
            </div>

            <div>
              <label className="eyebrow block mb-2">Correo electrónico</label>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juana@escuela.edu"
                className="w-full bg-transparent border-0 border-b border-line py-2.5 text-[17px] font-serif focus:outline-none focus:border-orange transition-colors placeholder:text-mute-soft"
              />
            </div>

            <div>
              <label className="eyebrow block mb-2">Contraseña</label>
              <input
                required
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-transparent border-0 border-b border-line py-2.5 text-[17px] font-serif focus:outline-none focus:border-orange transition-colors placeholder:text-mute-soft"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-paper py-3.5 text-[14px] hover:bg-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <>
                    <span className="ink-pulse" />
                    Creando tu espacio…
                  </>
                ) : (
                  <>
                    Crear cuenta
                    <span className="heart" style={{ background: '#FAFAFA' }} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-[13px] text-mute">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-ink hover:text-orange transition-colors underline underline-offset-4 decoration-line">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
