import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { updateAppUser } from '@/lib/db';
import type { AppUser } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, Save, Check } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ROLE_LABEL: Record<string, string> = {
  teacher:     'Docente',
  coordinator: 'Coordinador',
  admin:       'Administrador',
};

const ROLE_BG: Record<string, string> = {
  teacher:     'var(--color-butter)',
  coordinator: 'var(--color-mint)',
  admin:       'var(--color-blush)',
};

export default function Account() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();

  const [fullName, setFullName]       = useState('');
  const [phone, setPhone]             = useState('');
  const [subjectArea, setSubjectArea] = useState('');
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? '');
    setPhone(profile.phone ?? '');
    setSubjectArea(profile.subject_area ?? '');
  }, [profile]);

  const initials = (profile?.full_name || user?.email || 'T')
    .split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateAppUser(user.id, {
        full_name:    fullName.trim() || undefined,
        phone:        phone.trim()    || undefined,
        subject_area: subjectArea.trim() || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[700px] px-6 md:px-10 py-10">

        {/* Header */}
        <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
          <Star size={13} fill="var(--color-orange)" />
          mi cuenta
        </div>
        <h1 className="font-display m-0 mb-8" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Tu{' '}
          <span className="serif-em" style={{ color: 'var(--color-orange)' }}>perfil</span>
        </h1>

        {/* Avatar + role */}
        <div className="sticker p-6 mb-6 flex items-center gap-5" style={{ background: 'var(--color-paper)' }}>
          <div
            className="rounded-full font-bold text-[22px] flex items-center justify-center shrink-0"
            style={{
              width: 64, height: 64,
              background: 'var(--color-butter)',
              border: '3px solid var(--color-plum)',
              color: 'var(--color-plum)',
            }}
          >
            {initials}
          </div>
          <div>
            <div className="font-bold text-[18px]">{profile?.full_name || user?.email}</div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className="chip text-[12px] font-bold"
                style={{ background: ROLE_BG[profile?.role ?? 'teacher'] }}
              >
                {ROLE_LABEL[profile?.role ?? 'teacher']}
              </span>
              {profile?.institution_id && (
                <span className="chip text-[12px]" style={{ background: 'var(--color-lilac)' }}>
                  Institución vinculada
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Read-only info */}
        <div className="sticker p-6 mb-6 space-y-4" style={{ background: 'var(--color-paper)' }}>
          <div className="font-bold text-[14px] mb-2" style={{ color: 'var(--color-mute)' }}>
            INFORMACIÓN DE CUENTA
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Correo electrónico</div>
            <div className="text-[15px] font-semibold">{user?.email}</div>
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Rol</div>
            <div className="text-[15px] font-semibold">{ROLE_LABEL[profile?.role ?? 'teacher']}</div>
          </div>

          {profile?.created_at && (
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Miembro desde</div>
              <div className="text-[15px] font-semibold">
                {new Date(profile.created_at).toLocaleDateString('es-CO', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </div>
            </div>
          )}
        </div>

        {/* Editable fields */}
        <form
          onSubmit={handleSave}
          className="sticker p-6 space-y-5"
          style={{ background: 'var(--color-paper)' }}
        >
          <div className="font-bold text-[14px]" style={{ color: 'var(--color-mute)' }}>
            EDITAR PERFIL
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Nombre completo</div>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Prof. Juana Pérez"
              className="w-full bg-transparent border-0 border-b py-2 text-[16px] focus:outline-none transition-colors"
              style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
            />
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Teléfono (opcional)</div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 000 0000"
              className="w-full bg-transparent border-0 border-b py-2 text-[16px] focus:outline-none transition-colors"
              style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
            />
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Área de especialidad (opcional)</div>
            <input
              value={subjectArea}
              onChange={(e) => setSubjectArea(e.target.value)}
              placeholder="Matemáticas, Ciencias Naturales…"
              className="w-full bg-transparent border-0 border-b py-2 text-[16px] focus:outline-none transition-colors"
              style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-chunky btn-chunky-primary"
              style={{ padding: '12px 22px', fontSize: 14 }}
            >
              {saving
                ? <><Loader2 size={14} className="animate-spin" />Guardando…</>
                : saved
                ? <><Check size={14} />Cambios guardados</>
                : <><Save size={14} />Guardar cambios</>}
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}