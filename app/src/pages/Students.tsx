import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import {
  getStudentsByClass,
  createStudent,
  enrollStudentInClass,
  unenrollStudentFromClass,
  getClasses,
  importStudentsToClass,
} from '@/lib/db';
import type { Student, Class, CsvStudentRow, ImportResult } from '@/types';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2, Plus, UserMinus, Upload, Download, ArrowLeft, FileText, AlertCircle, Check } from 'lucide-react';
import { Star } from '@/components/tiza/Mark';

// ── CSV parsing ──────────────────────────────────────────────

function parseCSVRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current); current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// Maps CSV header names (Spanish or English) to CsvStudentRow keys
const HEADER_MAP: Record<string, keyof CsvStudentRow> = {
  nombre: 'full_name', 'nombre completo': 'full_name', full_name: 'full_name', name: 'full_name',
  codigo: 'student_code', código: 'student_code', student_code: 'student_code', code: 'student_code',
  email: 'email', correo: 'email', 'correo electrónico': 'email',
  acudiente: 'guardian_name', guardian_name: 'guardian_name', guardian: 'guardian_name', 'nombre acudiente': 'guardian_name',
  telefono: 'guardian_phone', teléfono: 'guardian_phone', guardian_phone: 'guardian_phone',
  'telefono acudiente': 'guardian_phone', 'teléfono acudiente': 'guardian_phone',
};

interface ParsedRow extends CsvStudentRow {
  _line: number;
  _error?: string;
}

function parseCSV(text: string): { rows: ParsedRow[]; error?: string } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], error: 'El archivo está vacío o solo tiene encabezados.' };

  const headers = parseCSVRow(lines[0]).map((h) => h.trim().toLowerCase());
  const nameCol = headers.findIndex((h) => HEADER_MAP[h] === 'full_name');
  if (nameCol === -1) {
    return {
      rows: [],
      error: 'No se encontró la columna "nombre". Descarga la plantilla para ver el formato correcto.',
    };
  }

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVRow(lines[i]).map((v) => v.trim());
    if (vals.every((v) => !v)) continue; // skip blank rows

    const row: ParsedRow = { full_name: '', _line: i + 1 };
    headers.forEach((h, idx) => {
      const key = HEADER_MAP[h];
      if (key && vals[idx]) (row as unknown as Record<string, string>)[key] = vals[idx];
    });

    if (!row.full_name) {
      row._error = `Fila ${i + 1}: el nombre es obligatorio.`;
    }
    rows.push(row);
  }

  return { rows };
}

// ── CSV template download ─────────────────────────────────────

const CSV_TEMPLATE =
  'nombre,codigo,email,acudiente,telefono_acudiente\n' +
  'Ana García López,2024-001,ana@escuela.edu,Marta López,+57 300 1234567\n' +
  'Juan Pérez Gómez,2024-002,,,\n';

function downloadTemplate() {
  const blob = new Blob(['﻿' + CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'plantilla_estudiantes_tiza.csv';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ── Component ─────────────────────────────────────────────────

type Mode = 'list' | 'manual' | 'csv-upload' | 'csv-preview' | 'csv-done';

export default function Students() {
  const { classId } = useParams<{ classId: string }>();
  const { user }    = useAuth();
  const { profile } = useProfile();

  const [cls, setCls]           = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading]   = useState(true);
  const [mode, setMode]         = useState<Mode>('list');

  // Manual form
  const [fullName, setFullName]       = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [email, setEmail]             = useState('');
  const [saving, setSaving]           = useState(false);

  // CSV state
  const fileRef                             = useRef<HTMLInputElement>(null);
  const [csvRows, setCsvRows]               = useState<ParsedRow[]>([]);
  const [csvFileError, setCsvFileError]     = useState('');
  const [importing, setImporting]           = useState(false);
  const [importResult, setImportResult]     = useState<ImportResult | null>(null);

  // Unenroll
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!classId || !user) return;
    Promise.all([getClasses(user.id), getStudentsByClass(classId)])
      .then(([classes, studs]) => {
        setCls(classes.find((c) => c.id === classId) ?? null);
        setStudents(studs);
      })
      .finally(() => setLoading(false));
  }, [classId, user]);

  // ── Manual add ──────────────────────────────────────────────

  const handleManualAdd = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!classId || !user || !profile?.institution_id) return;
    setSaving(true);
    try {
      const student = await createStudent({
        institution_id: profile.institution_id,
        teacher_id:     user.id,
        full_name:      fullName.trim(),
        student_code:   studentCode.trim() || undefined,
        email:          email.trim()        || undefined,
        is_active:      true,
      });
      await enrollStudentInClass(classId, student.id);
      setStudents((prev) =>
        [...prev, student].sort((a, b) => a.full_name.localeCompare(b.full_name)),
      );
      setFullName(''); setStudentCode(''); setEmail('');
      setMode('list');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── Unenroll ────────────────────────────────────────────────

  const handleUnenroll = async (studentId: string) => {
    if (!classId || !confirm('¿Quitar este estudiante de la clase? No se elimina su registro.')) return;
    setRemoving(studentId);
    try {
      await unenrollStudentFromClass(classId, studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  // ── CSV file parsing ─────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { rows, error } = parseCSV(text);
      if (error) { setCsvFileError(error); return; }
      setCsvRows(rows);
      setMode('csv-preview');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // ── CSV import ───────────────────────────────────────────────

  const handleImport = async () => {
    if (!classId || !user || !profile?.institution_id) return;
    const validRows = csvRows.filter((r) => !r._error && r.full_name);
    if (!validRows.length) return;
    setImporting(true);
    try {
      const result = await importStudentsToClass(
        classId,
        user.id,
        profile.institution_id,
        validRows,
      );
      setImportResult(result);
      // Refresh student list
      const fresh = await getStudentsByClass(classId);
      setStudents(fresh);
      setMode('csv-done');
    } catch (err) {
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  const resetCsv = () => {
    setCsvRows([]); setCsvFileError(''); setImportResult(null);
    if (fileRef.current) fileRef.current.value = '';
    setMode('list');
  };

  // ── Derived counts ───────────────────────────────────────────

  const validRowCount  = csvRows.filter((r) => !r._error && r.full_name).length;
  const invalidRowCount = csvRows.filter((r) => !!r._error).length;

  // ── Render ───────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[900px] px-6 md:px-10 py-10">

        <Link
          to="/classes"
          className="btn-chunky no-underline mb-6 inline-flex"
          style={{ padding: '8px 14px', fontSize: 13 }}
        >
          <ArrowLeft size={14} />
          Mis clases
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4 mt-4">
          <div>
            <div className="flex items-center gap-2 label mb-2" style={{ color: 'var(--color-mute)' }}>
              <Star size={13} fill="var(--color-orange)" />
              {cls?.name ?? 'Cargando…'}
            </div>
            <h1 className="font-display m-0" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
              Lista de{' '}
              <span className="serif-em" style={{ color: 'var(--color-orange)' }}>estudiantes</span>
            </h1>
          </div>

          {mode === 'list' && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setMode('manual')}
                className="btn-chunky btn-chunky-primary"
                style={{ padding: '10px 16px', fontSize: 13 }}
              >
                <Plus size={14} />
                Agregar
              </button>
              <button
                onClick={() => { setCsvFileError(''); setMode('csv-upload'); }}
                className="btn-chunky"
                style={{ padding: '10px 16px', fontSize: 13, background: 'var(--color-lilac)' }}
              >
                <Upload size={14} />
                Importar CSV
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-orange)' }} />
          </div>
        )}

        {/* ── Manual add form ── */}
        {mode === 'manual' && (
          <form
            onSubmit={handleManualAdd}
            className="sticker p-6 mb-6 space-y-4"
            style={{ background: 'oklch(0.96 0.06 90)' }}
          >
            <div className="font-bold text-[15px]">Nuevo estudiante</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Nombre completo *</div>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ana García López"
                  className="w-full bg-transparent border-0 border-b py-2 text-[15px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}
                />
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Código (opcional)</div>
                <input
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="2024-001"
                  className="w-full bg-transparent border-0 border-b py-2 text-[15px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}
                />
              </div>
              <div>
                <div className="label mb-1" style={{ color: 'var(--color-mute)' }}>Correo (opcional)</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ana@escuela.edu"
                  className="w-full bg-transparent border-0 border-b py-2 text-[15px] focus:outline-none"
                  style={{ borderColor: 'oklch(0.24 0.06 340 / 0.3)' }}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="btn-chunky btn-chunky-primary"
                style={{ padding: '10px 18px', fontSize: 13 }}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Agregar
              </button>
              <button
                type="button"
                className="btn-chunky"
                style={{ padding: '10px 18px', fontSize: 13 }}
                onClick={() => setMode('list')}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* ── CSV upload panel ── */}
        {mode === 'csv-upload' && (
          <div className="sticker p-6 mb-6 space-y-5" style={{ background: 'var(--color-paper)' }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="font-bold text-[15px]">Importar desde CSV</div>
              <button
                onClick={downloadTemplate}
                className="btn-chunky text-[12px]"
                style={{ padding: '7px 14px', background: 'var(--color-mint)' }}
              >
                <Download size={13} />
                Descargar plantilla
              </button>
            </div>

            <p className="text-[13px]" style={{ color: 'var(--color-mute)', lineHeight: 1.5 }}>
              El archivo debe tener una columna <strong>nombre</strong> (obligatoria).
              Columnas opcionales: <strong>codigo</strong>, <strong>email</strong>, <strong>acudiente</strong>, <strong>telefono_acudiente</strong>.
            </p>

            {csvFileError && (
              <div
                className="sticker p-3 flex items-start gap-2 text-[13px]"
                style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.55 0.18 25)' }}
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {csvFileError}
              </div>
            )}

            <div
              className="sticker p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--color-cream)', borderStyle: 'dashed' }}
              onClick={() => fileRef.current?.click()}
            >
              <FileText size={32} style={{ color: 'var(--color-mute)' }} />
              <div className="font-semibold text-[14px]">Haz clic para seleccionar el archivo CSV</div>
              <div className="text-[12px]" style={{ color: 'var(--color-mute)' }}>
                Formato: UTF-8, separado por comas
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileSelect}
            />

            <button
              onClick={() => setMode('list')}
              className="btn-chunky"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              Cancelar
            </button>
          </div>
        )}

        {/* ── CSV preview ── */}
        {mode === 'csv-preview' && (
          <div className="sticker p-6 mb-6 space-y-5" style={{ background: 'var(--color-paper)' }}>
            <div className="font-bold text-[15px]">Previsualización — {csvRows.length} fila{csvRows.length !== 1 ? 's' : ''} detectada{csvRows.length !== 1 ? 's' : ''}</div>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-2">
              <span className="chip font-semibold" style={{ background: 'var(--color-mint)' }}>
                <Check size={12} />
                {validRowCount} lista{validRowCount !== 1 ? 's' : ''} para importar
              </span>
              {invalidRowCount > 0 && (
                <span className="chip font-semibold" style={{ background: 'var(--color-blush)' }}>
                  <AlertCircle size={12} />
                  {invalidRowCount} con error
                </span>
              )}
            </div>

            {/* Preview table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr style={{ borderBottom: '2px solid oklch(0.24 0.06 340 / 0.15)' }}>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: 'var(--color-mute)' }}>#</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: 'var(--color-mute)' }}>Nombre</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: 'var(--color-mute)' }}>Código</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: 'var(--color-mute)' }}>Email</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: 'var(--color-mute)' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {csvRows.map((row) => (
                    <tr
                      key={row._line}
                      style={{
                        borderBottom: '1px solid oklch(0.24 0.06 340 / 0.08)',
                        background: row._error ? 'oklch(0.97 0.04 25)' : 'transparent',
                      }}
                    >
                      <td className="py-2 px-3" style={{ color: 'var(--color-mute)' }}>{row._line}</td>
                      <td className="py-2 px-3 font-semibold">{row.full_name || <em style={{ color: 'var(--color-mute)' }}>vacío</em>}</td>
                      <td className="py-2 px-3">{row.student_code ?? '—'}</td>
                      <td className="py-2 px-3">{row.email ?? '—'}</td>
                      <td className="py-2 px-3">
                        {row._error
                          ? <span style={{ color: 'oklch(0.5 0.18 25)' }}>{row._error}</span>
                          : <span style={{ color: 'oklch(0.45 0.15 145)' }}>✓ válido</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 flex-wrap pt-1">
              <button
                onClick={handleImport}
                disabled={importing || validRowCount === 0}
                className="btn-chunky btn-chunky-primary"
                style={{ padding: '12px 20px', fontSize: 14 }}
              >
                {importing
                  ? <><Loader2 size={14} className="animate-spin" />Importando…</>
                  : <><Upload size={14} />Importar {validRowCount} estudiante{validRowCount !== 1 ? 's' : ''}</>}
              </button>
              <button
                onClick={resetCsv}
                className="btn-chunky"
                style={{ padding: '12px 20px', fontSize: 14 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ── Import result ── */}
        {mode === 'csv-done' && importResult && (
          <div className="sticker p-6 mb-6 space-y-4" style={{ background: 'var(--color-mint)' }}>
            <div className="font-hand text-[22px]" style={{ color: 'var(--color-orange)' }}>¡Listo! ✿</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="sticker p-3" style={{ background: 'oklch(1 0 0 / 0.6)' }}>
                <div className="font-bold text-[24px]">{importResult.created}</div>
                <div className="text-[11px] font-semibold" style={{ color: 'var(--color-mute)' }}>nuevos</div>
              </div>
              <div className="sticker p-3" style={{ background: 'oklch(1 0 0 / 0.6)' }}>
                <div className="font-bold text-[24px]">{importResult.enrolled}</div>
                <div className="text-[11px] font-semibold" style={{ color: 'var(--color-mute)' }}>matriculados</div>
              </div>
              <div className="sticker p-3" style={{ background: 'oklch(1 0 0 / 0.6)' }}>
                <div className="font-bold text-[24px]">{importResult.skipped}</div>
                <div className="text-[11px] font-semibold" style={{ color: 'var(--color-mute)' }}>omitidos</div>
              </div>
            </div>
            {importResult.errors.length > 0 && (
              <div className="space-y-1">
                {importResult.errors.map((e, i) => (
                  <div key={i} className="text-[12px]" style={{ color: 'oklch(0.45 0.15 25)' }}>• {e}</div>
                ))}
              </div>
            )}
            <button
              onClick={resetCsv}
              className="btn-chunky btn-chunky-primary"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              Ver lista
            </button>
          </div>
        )}

        {/* ── Student list ── */}
        {!loading && mode === 'list' && (
          <>
            {students.length === 0 ? (
              <div className="sticker p-10 text-center" style={{ background: 'var(--color-paper)' }}>
                <p className="font-semibold text-[16px]">No hay estudiantes en esta clase.</p>
                <p className="text-[13px] mt-1" style={{ color: 'var(--color-mute)' }}>
                  Agrega estudiantes manualmente o importa una lista CSV.
                </p>
              </div>
            ) : (
              <>
                <div className="label mb-4" style={{ color: 'var(--color-mute)' }}>
                  {students.length} estudiante{students.length !== 1 ? 's' : ''}
                </div>
                <div className="space-y-2">
                  {students.map((s, i) => (
                    <div
                      key={s.id}
                      className="sticker p-4 flex items-center justify-between gap-4"
                      style={{ background: 'var(--color-paper)' }}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="rounded-full font-bold text-[12px] flex items-center justify-center shrink-0"
                          style={{
                            width: 32, height: 32,
                            background: 'var(--color-lilac)',
                            border: '2px solid var(--color-plum)',
                          }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-[14px]">{s.full_name}</div>
                          <div className="text-[12px]" style={{ color: 'var(--color-mute)' }}>
                            {[s.student_code, s.email].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      </div>
                      <button
                        title="Quitar de esta clase"
                        className="btn-chunky"
                        style={{
                          padding: '6px 10px',
                          fontSize: 13,
                          opacity: removing === s.id ? 0.5 : 1,
                        }}
                        disabled={removing === s.id}
                        onClick={() => handleUnenroll(s.id)}
                      >
                        {removing === s.id
                          ? <Loader2 size={13} className="animate-spin" />
                          : <UserMinus size={13} />}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </DashboardLayout>
  );
}