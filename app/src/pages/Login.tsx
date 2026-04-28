import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Bolt } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-surface font-sans">
      {/* Left Side - Hero */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-primary text-white relative overflow-hidden">
        <div className="logo flex items-center gap-2 text-xl font-bold">
          <div className="w-6 h-6 bg-white text-primary rounded flex items-center justify-center text-sm">T</div>
          TIZA
        </div>
        
        <div className="max-w-md">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Empoderando a los educadores con IA.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Diseña lecciones impactantes, gestiona tu aula y recupera tu tiempo para lo que más importa: enseñar.
          </p>
        </div>

        <div className="testimonial p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
          <p className="italic text-sm mb-4">
            "Tiza ha transformado completamente mi preparación de clases. Lo que antes me tomaba horas, ahora lo hago en minutos con una calidad superior."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full" />
            <div>
              <p className="text-sm font-bold">Dra. Elena Martínez</p>
              <p className="text-xs opacity-70">Profesora de Ciencias</p>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center p-8 md:p-24 bg-surface">
        <div className="max-w-sm w-full mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-text-main">Bienvenido de nuevo</h2>
            <p className="text-text-muted">Ingresa tus credenciales para acceder a tu panel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-md">{error}</p>}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-text-muted">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@escuela.edu" 
                    className="pl-10 h-11 bg-surface border-border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase text-text-muted">Contraseña</Label>
                  <button type="button" className="text-xs font-semibold text-primary hover:underline">¿Olvidaste tu contraseña?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="pl-10 h-11 bg-surface border-border rounded-md"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white rounded-md h-11 font-semibold shadow-sm transition-all"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-text-muted">O continuar con</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full border-border text-text-main rounded-md h-11 flex items-center justify-center gap-2 font-medium hover:bg-slate-50"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Google
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
