import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, School, Mail, Lock, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with full name
      await updateProfile(user, {
        displayName: fullName
      });
      
      // Save user profile to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: fullName,
          institution: institution,
          email: email,
          role: 'teacher',
          createdAt: new Date().toISOString()
        });
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.WRITE, `users/${user.uid}`);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            Únete a la comunidad de educadores modernos.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Crea una cuenta gratuita y comienza a diseñar experiencias de aprendizaje memorables hoy mismo.
          </p>
        </div>

        <div className="features grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/10 rounded-lg border border-white/20">
            <ShieldCheck className="w-6 h-6 mb-2" />
            <p className="text-sm font-bold">Seguro y Privado</p>
            <p className="text-xs opacity-70">Tus datos están protegidos.</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg border border-white/20">
            <Globe className="w-6 h-6 mb-2" />
            <p className="text-sm font-bold">Acceso Global</p>
            <p className="text-xs opacity-70">Desde cualquier dispositivo.</p>
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
            <h2 className="text-3xl font-bold text-text-main">Crear Cuenta</h2>
            <p className="text-text-muted">Comienza tu viaje con TIZA hoy.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && <p className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-md">{error}</p>}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-text-muted">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Prof. Juana Pérez" 
                    className="pl-10 h-11 bg-surface border-border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-text-muted">Institución Educativa</Label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input 
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Colegio San José" 
                    className="pl-10 h-11 bg-surface border-border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-text-muted">Correo Institucional</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juana@institucion.edu" 
                    className="pl-10 h-11 bg-surface border-border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-text-muted">Contraseña</Label>
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
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
