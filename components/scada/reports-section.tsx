"use client"

import { FileText, Download } from "lucide-react"

interface Report {
  title: string
  category: string
  date: string
  size: string
  categoryColor: string
}

const reports: Report[] = [
  {
    title: "Rapport Performance Globale",
    category: "Performance Globale",
    date: "11/12/2025",
    size: "2.4 MB",
    categoryColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  },
  {
    title: "Intelligence Artificielle - Décembre",
    category: "Intelligence Artificielle",
    date: "10/12/2025",
    size: "5.8 MB",
    categoryColor: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  {
    title: "Analyse Énergétique Mensuelle",
    category: "Énergie",
    date: "10/12/2025",
    size: "5.2 MB",
    categoryColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  {
    title: "Audit Ressources Hydrauliques",
    category: "Ressources Hydrauliques",
    date: "08/12/2025",
    size: "3.8 MB",
    categoryColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  {
    title: "Rapport Hebdomadaire Opérations",
    category: "Performance Globale",
    date: "08/12/2025",
    size: "8.1 MB",
    categoryColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  },
  {
    title: "Bilan Mensuel Novembre",
    category: "Performance Globale",
    date: "01/12/2025",
    size: "24.5 MB",
    categoryColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  },
  {
    title: "Centrale Thermique - Performance",
    category: "Centrale Thermique",
    date: "28/11/2025",
    size: "4.2 MB",
    categoryColor: "bg-orange-500/20 text-orange-400 border-orange-500/30"
  },
  {
    title: "Unité Sulfurique - Analyse Vapeur",
    category: "Unité Sulfurique",
    date: "25/11/2025",
    size: "3.6 MB",
    categoryColor: "bg-red-500/20 text-red-400 border-red-500/30"
  },
  {
    title: "TED - Traitement Eau Démineralisée",
    category: "TED",
    date: "22/11/2025",
    size: "2.9 MB",
    categoryColor: "bg-green-500/20 text-green-400 border-green-500/30"
  },
  {
    title: "CAP U/V/W - Analyse Condensat",
    category: "CAP",
    date: "20/11/2025",
    size: "6.7 MB",
    categoryColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
  }
]

export function ReportsSection() {
  const handleDownload = (format: "pdf" | "excel", reportTitle: string) => {
    console.log(`Downloading ${reportTitle} as ${format}`)
    // TODO: Implement actual download logic
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-cyan-400" />
        <h2 className="text-3xl font-bold text-white">Rapports Disponibles</h2>
      </div>

      <div className="space-y-3">
        {reports.map((report, index) => (
          <div
            key={index}
            className="relative bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/70 transition-all hover:bg-slate-900/70"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <FileText className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{report.title}</h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-md border font-medium ${report.categoryColor}`}>
                      {report.category}
                    </span>
                    <span className="text-sm text-slate-400">{report.date} • {report.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload("pdf", report.title)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleDownload("excel", report.title)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
