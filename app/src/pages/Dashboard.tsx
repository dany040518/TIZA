import { motion } from 'motion/react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  TrendingDown, 
  AlertCircle, 
  FileText,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'Docente';

  const days = [
    { name: 'LUN', date: 21 },
    { name: 'MAR', date: 22 },
    { name: 'MIÉ', date: 23 },
    { name: 'JUE', date: 24, active: true },
    { name: 'VIE', date: 25 },
    { name: 'SÁB', date: 26 },
    { name: 'DOM', date: 27 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome AI Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="card bg-surface border border-border rounded-xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Asistente AI Activo
                </div>
                <h1 className="text-3xl font-bold text-text-main leading-tight">
                  Buenos días, {firstName}.<br />
                  Hoy tienes <span className="text-primary">3 acciones clave</span> pendientes.
                </h1>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-text-muted text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    3 grupos sin asistencia
                  </li>
                  <li className="flex items-center gap-3 text-text-muted text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    14 tareas por calificar
                  </li>
                  <li className="flex items-center gap-3 text-text-muted text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    2 informes por generar
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Button className="bg-primary hover:bg-primary-dark text-white rounded-md px-8 py-6 font-semibold shadow-sm">
                  Comenzar
                </Button>
                <button className="text-xs text-primary font-semibold hover:underline">
                  Ver todas las tareas
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-main">Tu Calendario</h2>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-slate-100 rounded-md transition-colors border border-border">
                <ChevronLeft className="w-4 h-4 text-text-muted" />
              </button>
              <button className="p-1 hover:bg-slate-100 rounded-md transition-colors border border-border">
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => (
              <div 
                key={day.date}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer border",
                  day.active 
                    ? "bg-primary text-white border-primary shadow-md scale-105" 
                    : "bg-surface text-text-muted border-border hover:bg-slate-50"
                )}
              >
                <span className="text-[10px] font-bold opacity-70 uppercase">{day.name}</span>
                <span className="text-xl font-bold">{day.date}</span>
                {day.active && <div className="w-1 h-1 bg-white rounded-full" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Clase Actual</p>
                <h3 className="font-bold text-text-main">Biología Celular</h3>
                <p className="text-xs text-text-muted">Finaliza en 15 min</p>
              </div>
            </div>
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex items-center justify-between opacity-60">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Siguiente clase en 30 min</p>
                <h3 className="font-bold text-text-main">Genética Molecular</h3>
                <p className="text-xs text-text-muted">Aula 302 • 10:30 AM</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="card bg-surface border border-border rounded-xl p-6 shadow-sm h-full">
              <div className="w-10 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center text-primary mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-text-main">AI Insight</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Detectamos que 5 estudiantes muestran bajo rendimiento esta semana en Biología.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="card bg-destructive text-white rounded-xl p-6 shadow-md h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertCircle className="w-24 h-24" />
              </div>
              <div className="space-y-4 relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">! Acción Urgente</p>
                <h3 className="text-xl font-bold leading-tight">Tomar asistencia ahora</h3>
                <button className="flex items-center gap-2 text-xs font-bold hover:gap-3 transition-all">
                  Ir a la clase <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="card bg-surface border border-border rounded-xl p-6 shadow-sm h-full">
              <div className="w-10 h-10 bg-[#fef3c7] rounded-lg flex items-center justify-center text-amber-600 mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-text-main">14</p>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Notas pendientes</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
