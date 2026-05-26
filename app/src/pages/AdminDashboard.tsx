import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getInstitutionsWithCodes, createInstitution, createInviteCode, deleteInstitution } from '@/lib/db';
import type { Institution, InviteCode, InstitutionType } from '@/types';
import { useToast } from '@/components/Toast';
import { Loader2, Plus, Building2, Trash2 } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';

const TYPE_LABEL: Record<InstitutionType, string> = {
  preescolar:  'Preescolar',
  primaria:    'Primaria',
  secundaria:  'Secundaria',
  universidad: 'Universidad',
  otro:        'Otro',
};

const TYPE_BG: Record<InstitutionType, string> = {
  preescolar:  'var(--color-mint)',
  primaria:    'var(--color-butter)',
  secundaria:  'var(--color-blush)',
  universidad: 'var(--color-lilac)',
  otro:        'var(--color-paper)',
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

// Estándar: [3 LETRAS][3 DÍGITOS]-T  /  [3 LETRAS][3 DÍGITOS]-C
// Ej.: COL428-T y COL428-C
function generateCodePair(name: string): { teacher: string; coordinator: string } {
  const base = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3).padEnd(3, 'X');
  const num  = Math.floor(Math.random() * 900 + 100).toString();
  return { teacher: `${base}${num}-T`, coordinator: `${base}${num}-C` };
}

type InstitutionWithCodes = Institution & { invite_codes: InviteCode[] };

export default function AdminDashboard() {
  const { success, error: toastError } = useToast();
  const [institutions, setInstitutions] = useState<InstitutionWithCodes[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const [name, setName]       = useState('');
  const [type, setType]       = useState<InstitutionType>('secundaria');
  const [city, setCity]       = useState('');
  const [country, setCountry] = useState('CO');
  const [saving, setSaving]   = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getInstitutionsWithCodes()
      .then((data) => setInstitutions(data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setFormError('');
    try {
      const inst = await createInstitution({
        name:      name.trim(),
        slug:      generateSlug(name.trim()),
        type,
        city:      city.trim(),
        country:   country.trim().toUpperCase().slice(0, 2) || 'CO',
        is_active: true,
      });
      const { teacher: tCode, coordinator: cCode } = generateCodePair(name.trim());
      const [teacherCode, coordCode] = await Promise.all([
        createInviteCode(inst.id, tCode, 'teacher'),
        createInviteCode(inst.id, cCode, 'coordinator'),
      ]);
      setInstitutions((prev) => [{ ...inst, invite_codes: [teacherCode, coordCode] }, ...prev]);
      setShowForm(false);
      setName(''); setCity(''); setType('secundaria'); setCountry('CO');
      success(`"${inst.name}" creada · Docente: ${teacherCode.code} · Coordinador: ${coordCode.code}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear la institución.';
      setFormError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (instId: string) => {
    setDeleting(true);
    try {
      await deleteInstitution(instId);
      setInstitutions((prev) => prev.filter((i) => i.id !== instId));
      setConfirmDeleteId(null);
      success('Institución eliminada.');
    } catch {
      toastError('No se pudo eliminar la institución.');
    } finally {
      setDeleting(false);
    }
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
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
              <Star size={13} fill="var(--color-orange)" />
              panel administrador
            </div>
            <h1 className="font-display m-0" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
              Instituciones{' '}
              <span className="serif-em" style={{ color: 'var(--color-orange)' }}>educativas</span>
            </h1>
          </div>
          <button
            onClick={() => { setShowForm((v) => !v); setFormError(''); }}
            className="btn-chunky btn-chunky-primary"
            style={{ padding: '12px 20px', fontSize: 14 }}
          >
            <Plus size={16} />
            Nueva institución
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="sticker p-6 mb-8 space-y-5"
            style={{ background: 'var(--color-paper)' }}
          >
            <div className="font-bold text-[14px]" style={{ color: 'var(--color-mute)' }}>
              NUEVA INSTITUCIÓN
            </div>

            {formError && (
              <div className="sticker p-3 text-[13px]"
                style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}>
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Nombre de la institución *</div>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Colegio San Francisco"
                  className="w-full bg-transparent border-0 border-b py-2 text-[16px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                />
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Tipo</div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as InstitutionType)}
                  className="w-full bg-transparent border-0 border-b py-2 text-[16px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                >
                  {(Object.keys(TYPE_LABEL) as InstitutionType[]).map((v) => (
                    <option key={v} value={v}>{TYPE_LABEL[v]}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Ciudad</div>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bogotá"
                  className="w-full bg-transparent border-0 border-b py-2 text-[16px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                />
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>País (código ISO)</div>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value.toUpperCase().slice(0, 2))}
                  placeholder="CO"
                  maxLength={2}
                  className="w-full bg-transparent border-0 border-b py-2 text-[16px] tracking-widest font-bold focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)', color: 'var(--color-plum)' }}
                />
              </div>
            </div>

            <p className="text-[12px]" style={{ color: 'var(--color-mute)' }}>
              Se generarán automáticamente un código para docentes y uno para coordinadores.
            </p>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving}
                className="btn-chunky btn-chunky-primary"
                style={{ padding: '12px 20px', fontSize: 14 }}>
                {saving ? <><Loader2 size={14} className="animate-spin" />Creando…</> : <>Crear institución</>}
              </button>
              <button type="button"
                onClick={() => { setShowForm(false); setFormError(''); }}
                className="btn-chunky"
                style={{ padding: '12px 20px', fontSize: 14 }}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Count chip */}
        <div className="flex items-center gap-3 mb-6">
          <span className="chip font-bold" style={{ background: 'var(--color-butter)' }}>
            {institutions.length} institución{institutions.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {/* Empty state */}
        {institutions.length === 0 && (
          <div className="sticker p-12 text-center" style={{ background: 'var(--color-paper)' }}>
            <Building2 size={36} className="mx-auto mb-4" style={{ color: 'var(--color-mute)' }} />
            <p className="font-semibold text-[16px]">No hay instituciones registradas.</p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-mute)' }}>
              Crea la primera con el botón de arriba.
            </p>
          </div>
        )}

        {/* Institution cards */}
        <div className="space-y-4">
          {institutions.map((inst) => {
            const teacherCode = inst.invite_codes.find((c) => c.role === 'teacher');
            const coordCode   = inst.invite_codes.find((c) => c.role === 'coordinator');
            const isConfirming = confirmDeleteId === inst.id;

            return (
              <div key={inst.id} className="sticker p-5" style={{ background: 'var(--color-paper)' }}>

                {/* Delete confirmation banner */}
                {isConfirming && (
                  <div className="sticker p-4 mb-4 flex flex-wrap items-center gap-3"
                    style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}>
                    <span className="font-semibold text-[13px] flex-1">
                      ¿Eliminar <strong>{inst.name}</strong>? Se borrarán todas las clases, estudiantes, planeaciones y asistencias asociadas. Esta acción no se puede deshacer.
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(inst.id)}
                        disabled={deleting}
                        className="btn-chunky"
                        style={{ padding: '7px 14px', fontSize: 12, background: 'oklch(0.55 0.18 25)', color: 'white' }}
                      >
                        {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        Sí, eliminar
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="btn-chunky"
                        style={{ padding: '7px 14px', fontSize: 12 }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-start justify-between gap-4">

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h2 className="font-bold text-[16px] m-0">{inst.name}</h2>
                      <span className="chip text-[11px] font-bold" style={{ background: TYPE_BG[inst.type] }}>
                        {TYPE_LABEL[inst.type]}
                      </span>
                      {!inst.is_active && (
                        <span className="chip text-[11px] font-bold" style={{ background: 'oklch(0.7 0 0)', color: 'white' }}>
                          Inactiva
                        </span>
                      )}
                    </div>
                    <div className="text-[13px]" style={{ color: 'var(--color-mute)' }}>
                      {[inst.city, inst.country].filter(Boolean).join(', ')}
                      {inst.created_at && (
                        <> · Creada {new Date(inst.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</>
                      )}
                    </div>
                  </div>

                  {/* Codes + delete */}
                  <div className="flex items-start gap-2 shrink-0">
                    {/* Teacher code */}
                    {teacherCode && (
                      <div className="sticker px-4 py-2.5 text-center" style={{ background: 'var(--color-plum)' }}>
                        <div className="text-[9px] font-bold tracking-wider mb-0.5" style={{ color: 'oklch(1 0 0 / 0.45)' }}>
                          DOCENTE
                        </div>
                        <div className="font-bold text-[18px] tracking-widest" style={{ color: 'var(--color-butter)' }}>
                          {teacherCode.code}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'oklch(1 0 0 / 0.45)' }}>
                          {teacherCode.use_count} usos
                        </div>
                      </div>
                    )}
                    {/* Coordinator code */}
                    {coordCode && (
                      <div className="sticker px-4 py-2.5 text-center" style={{ background: 'oklch(0.28 0.08 280)' }}>
                        <div className="text-[9px] font-bold tracking-wider mb-0.5" style={{ color: 'oklch(1 0 0 / 0.45)' }}>
                          COORDINADOR
                        </div>
                        <div className="font-bold text-[18px] tracking-widest" style={{ color: 'var(--color-lilac)' }}>
                          {coordCode.code}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'oklch(1 0 0 / 0.45)' }}>
                          {coordCode.use_count} usos
                        </div>
                      </div>
                    )}
                    {/* Delete button */}
                    <button
                      onClick={() => setConfirmDeleteId(isConfirming ? null : inst.id)}
                      className="btn-chunky"
                      style={{ padding: '8px 10px', background: isConfirming ? 'oklch(0.95 0.06 25)' : undefined }}
                      title="Eliminar institución"
                    >
                      <Trash2 size={14} style={{ color: isConfirming ? 'oklch(0.55 0.18 25)' : 'var(--color-mute)' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}