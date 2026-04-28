import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { generateLessonPlan } from "@/services/geminiService";
import DashboardLayout from "../components/layouts/DashboardLayout";
import html2pdf from "html2pdf.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Planning() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [activePlan, setActivePlan] = useState<any>(null);

  const ideaTypes = [
    { label: "Gamificada", color: "bg-yellow-100 text-yellow-800" },
    { label: "Experimental", color: "bg-green-100 text-green-800" },
    { label: "Debate", color: "bg-indigo-100 text-indigo-800" },
  ];

  const phaseColors = [
    "bg-blue-100 text-blue-600",
    "bg-yellow-100 text-yellow-600",
    "bg-green-100 text-green-600"
  ];
  

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);

    try {
      const result = await generateLessonPlan(
        subject,
        grade,
        topic,
        context
      );

      if (result) {
        setIdeas(result.ideas || []);
        setSelectedIdea(null);

        if (auth.currentUser) {
          try {
            await addDoc(collection(db, "lessonPlans"), {
              teacherId: auth.currentUser.uid,
              subject,
              grade,
              topic,

              title: result.ideas[0]?.title,
              type: result.ideas[0]?.type,
              objective: result.ideas[0]?.objective,
              materials: result.ideas[0]?.materials,

              sequence: result.ideas[0]?.sequence || [],
              evaluation: result.ideas[0]?.evaluation,

              createdAt: serverTimestamp(),
            });
          } catch (fsErr) {
            handleFirestoreError(fsErr, OperationType.CREATE, "lessonPlans");
          }
        }
      }
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
  const element = document.getElementById("plan-panel");

  if (!element) return;

  // 👇 Clonar el nodo
  const clone = element.cloneNode(true) as HTMLElement;

  // 👇 FORZAR estilos compatibles
  clone.style.background = "#ffffff";
  clone.style.color = "#000000";

  // 👇 eliminar clases problemáticas (tailwind moderno)
  clone.querySelectorAll("*").forEach((el: any) => {
    el.style.backgroundColor = "#ffffff";
    el.style.color = "#000000";
    el.style.borderColor = "#e5e7eb"; // gris suave
  });

  html2pdf()
    .from(clone)
    .set({
      margin: 0.5,
      filename: "planeacion-clase.pdf",
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
    })
    .save();
};

  return (
  <DashboardLayout>
    <div className="w-full px-4 py-4 space-y-6">

      {/*GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

        {/* LEFT PANEL */}
        <div className="h-full">
          <Card className="p-5 space-y-4 sticky top-4">

            <h2 className="text-lg font-semibold">
              Planifica tu clase
            </h2>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Área</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matemáticas">Matemáticas</SelectItem>
                      <SelectItem value="Ciencias Naturales">Ciencias Naturales</SelectItem>
                      <SelectItem value="Lengua/Español">Lengua/Español</SelectItem>
                      <SelectItem value="Ciencias Sociales">Ciencias Sociales</SelectItem>
                      <SelectItem value="Inglés">Inglés</SelectItem>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                      <SelectItem value="Arte">Arte</SelectItem>
                      <SelectItem value="Educación Física">Educación Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Grado</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preescolar">Preescolar</SelectItem>
                    <SelectItem value="Primaria">Primaria</SelectItem>
                    <SelectItem value="Secundaria">Secundaria</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Universidad">Universidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Contexto</Label>
                <textarea
                  rows={3}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full border border-border rounded-xl p-2 text-sm"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "✨ Generar ideas"}
            </Button>

          </Card>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-4">

          {/* EMPTY */}
          {ideas.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10">
              <Sparkles className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Genera ideas para comenzar ✨
              </p>
            </div>
          )}

          {/* IDEAS */}
          {ideas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* LISTA */}
              <div className="space-y-4">
                {ideas.map((idea, idx) => (
                  <motion.div
                    key={idx}
                    onClick={() => setSelectedIdea(idea)}
                    className={cn(
                      "p-5 rounded-2xl cursor-pointer border transition",
                      selectedIdea === idea
                        ? "ring-2 ring-primary bg-primary/5"
                        : "bg-card hover:shadow"
                    )}
                  >
                    <h3 className="font-semibold text-sm">{idea.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {idea.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* DETALLE */}
              <div>
                {selectedIdea ? (
                  <div className="p-6 border rounded-2xl bg-card flex flex-col h-full">

                    <h2 className="font-semibold mb-2">
                      {selectedIdea.title}
                    </h2>

                    <div className="space-y-4">
                      {(selectedIdea.sequence || []).map((fase: any, i: number) => (
                        <div key={i} className="flex gap-3">

                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            phaseColors[i % phaseColors.length]
                          )}>
                            {i + 1}
                          </div>

                          <div>
                            <p className="text-sm font-medium">{fase.phase}</p>
                            <p className="text-xs text-muted-foreground">
                              {fase.duration} min
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {fase.description}
                            </p>
                          </div>

                        </div>
                      ))}
                    </div>

                    <Button
                      className="mt-auto"
                      onClick={async () => {
                        setActivePlan(selectedIdea);

                        setTimeout(() => {
                          document.getElementById("plan-panel")?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }, 100);

                        if (auth.currentUser) {
                          await addDoc(collection(db, "lessonPlans"), {
                            teacherId: auth.currentUser.uid,
                            subject,
                            grade,
                            topic,
                            ...selectedIdea,
                            createdAt: serverTimestamp(),
                          });
                        }
                      }}
                    >
                      Usar esta planeación
                    </Button>

                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Selecciona una idea
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* 🔥 PANEL ABAJO */}
{activePlan && (
  <div
    id="plan-panel"
    className="mt-6 border rounded-2xl bg-card p-6 shadow-sm animate-in fade-in"
  >

    {/* HEADER */}
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-xl font-semibold">
          {activePlan.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {activePlan.type}
        </p>
      </div>

      <div className="flex gap-2">
        {/* BOTÓN PDF */}
        <Button onClick={handleDownloadPDF} variant="outline">
          PDF
        </Button>
        {/* CERRAR */}
        <Button variant="ghost" onClick={() => setActivePlan(null)}>
          ✖
        </Button>
      </div>

    </div>

    {/* OBJETIVO */}
    <div className="mb-4">
      <p className="text-sm font-medium">Objetivo</p>
      <p className="text-sm text-muted-foreground">
        {activePlan.objective}
      </p>
    </div>

    {/* DURACIÓN */}
    <p className="text-xs text-muted-foreground mb-4">
      Duración total: {activePlan.duration} min
    </p>

    {/* MATERIALES */}
    <div className="mb-4">
      <p className="text-sm font-medium">Materiales</p>
      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
        {activePlan.materials?.map((m: string, i: number) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>

    {/* SECUENCIA */}
    <div className="space-y-5">
      {(activePlan.sequence || []).map((fase: any, i: number) => (
        <div key={i} className="flex gap-3">

          {/* CÍRCULO */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              phaseColors[i % phaseColors.length]
            )}
          >
            {i + 1}
          </div>

          {/* CONTENIDO */}
          <div>
            <p className="font-medium text-sm">
              {fase.phase} ({fase.duration ?? "-"} min)
            </p>
            <p className="text-sm text-muted-foreground">
              {fase.description}
            </p>
          </div>

        </div>
      ))}
    </div>

    {/* EVALUACIÓN */}
    <div className="mt-6">
      <p className="text-sm font-medium">Evaluación</p>
      <p className="text-sm text-muted-foreground">
        {activePlan.evaluation}
      </p>
    </div>

  </div>
)}

    </div>
  </DashboardLayout>
);
}