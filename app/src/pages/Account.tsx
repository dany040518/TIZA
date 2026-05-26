import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { updateAppUser } from '@/lib/db';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, Save, Check } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';
import { useToast } from '@/components/Toast';
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

function parsePhone(phone: string | null | undefined): { dialCode: string; number: string } {
  if (!phone) return { dialCode: '+57', number: '' };
  const trimmed = phone.trim();
  const sorted = [...DIAL_CODES].sort((a, b) => b.code.length - a.code.length);
  for (const { code } of sorted) {
    if (trimmed.startsWith(code)) {
      return { dialCode: code, number: trimmed.slice(code.length).trim() };
    }
  }
  return { dialCode: '+57', number: trimmed };
}

export default function Account() {
  const { user } = useAuth();
  const { profile, refresh, loading } = useProfile();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName]         = useState('');
  const [dialCode, setDialCode]         = useState('+57');
  const [phoneNumber, setPhoneNumber]   = useState('');
  const [subjectArea, setSubjectArea]   = useState('');
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? '');
    const parsed = parsePhone(profile.phone);
    setDialCode(parsed.dialCode);
    setPhoneNumber(parsed.number);
    setSubjectArea(profile.subject_area ?? '');
  }, [profile]);

  const initials = (profile?.full_name || user?.email || 'T')
    .split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      toastError('El nombre completo no puede estar vacío.');
      return;
    }

    if (phoneNumber && phoneNumber.length < 7) {
      toastError('El número de teléfono debe tener al menos 7 dígitos.');
      return;
    }

    const phone = phoneNumber.trim()
      ? `${dialCode} ${phoneNumber.trim()}`
      : null;

    setSaving(true);
    setSaved(false);
    try {
      await updateAppUser(user.id, {
        full_name:    trimmedName,
        phone,
        subject_area: subjectArea.trim() !== '' ? subjectArea.trim() : null,
      });
      setSaved(true);
      refresh();
      setTimeout(() => setSaved(false), 3000);
      success('Perfil actualizado correctamente.');
    } catch (err) {
      console.error('[Account] updateAppUser error:', err);
      toastError('No se pudo guardar el perfil. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const inputBorder = { borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' };

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
      <div className="mx-auto max-w-[700px] px-4 sm:px-6 md:px-10 py-8 sm:py-10">

        {/* Header */}
        <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
          <Star size={13} fill="var(--color-orange)" />
          mi cuenta
        </div>
        <h1 className="font-display m-0 mb-6 sm:mb-8" style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}>
          Tu{' '}
          <span className="serif-em" style={{ color: 'var(--color-orange)' }}>perfil</span>
        </h1>

        {/* Avatar + role */}
        <div className="sticker p-5 sm:p-6 mb-5 sm:mb-6 flex items-center gap-4 sm:gap-5" style={{ background: 'var(--color-paper)' }}>
          <div
            className="rounded-full font-bold text-[20px] sm:text-[22px] flex items-center justify-center shrink-0"
            style={{
              width: 56, height: 56,
              background: 'var(--color-butter)',
              border: '3px solid var(--color-plum)',
              color: 'var(--color-plum)',
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[16px] sm:text-[18px] truncate">{profile?.full_name || user?.email}</div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className="chip text-[11px] sm:text-[12px] font-bold"
                style={{ background: ROLE_BG[profile?.role ?? 'teacher'] }}
              >
                {ROLE_LABEL[profile?.role ?? 'teacher']}
              </span>
              {profile?.institution_id && (
                <span className="chip text-[11px] sm:text-[12px]" style={{ background: 'var(--color-lilac)' }}>
                  Institución vinculada
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Read-only info */}
        <div className="sticker p-5 sm:p-6 mb-5 sm:mb-6 space-y-4" style={{ background: 'var(--color-paper)' }}>
          <div className="font-bold text-[13px] sm:text-[14px] mb-2" style={{ color: 'var(--color-mute)' }}>
            INFORMACIÓN DE CUENTA
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Correo electrónico</div>
            <div className="text-[14px] sm:text-[15px] font-semibold break-all">{user?.email}</div>
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Rol</div>
            <div className="text-[14px] sm:text-[15px] font-semibold">{ROLE_LABEL[profile?.role ?? 'teacher']}</div>
          </div>

          {profile?.created_at && (
            <div>
              <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Miembro desde</div>
              <div className="text-[14px] sm:text-[15px] font-semibold">
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
          className="sticker p-5 sm:p-6 space-y-5"
          style={{ background: 'var(--color-paper)' }}
        >
          <div className="font-bold text-[13px] sm:text-[14px]" style={{ color: 'var(--color-mute)' }}>
            EDITAR PERFIL
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Nombre completo</div>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Prof. Juana Pérez"
              className="w-full bg-transparent border-0 border-b py-2 text-[15px] sm:text-[16px] focus:outline-none transition-colors"
              style={inputBorder}
            />
          </div>

          {/* Phone with dial code */}
          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Teléfono (opcional)</div>
            <div className="flex gap-0 border-b" style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}>
              <select
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                className="shrink-0 bg-transparent border-0 py-2 text-[14px] sm:text-[15px] focus:outline-none cursor-pointer pr-1"
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
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="3225092615"
                maxLength={15}
                className="flex-1 bg-transparent border-0 py-2 text-[15px] sm:text-[16px] focus:outline-none pl-2"
                style={{ color: 'var(--color-plum)' }}
              />
            </div>
          </div>

          <div>
            <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Área de especialidad (opcional)</div>
            <input
              value={subjectArea}
              onChange={(e) => setSubjectArea(e.target.value)}
              placeholder="Matemáticas, Ciencias Naturales…"
              className="w-full bg-transparent border-0 border-b py-2 text-[15px] sm:text-[16px] focus:outline-none transition-colors"
              style={inputBorder}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
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

            {/* Logout button — visible on mobile via Account page */}
            <button
              type="button"
              onClick={handleLogout}
              className="sm:hidden btn-chunky btn-chunky-ghost"
              style={{ padding: '12px 22px', fontSize: 14 }}
            >
              Cerrar sesión
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}