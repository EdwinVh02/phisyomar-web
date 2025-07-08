import React from "react";
import { Eye, XCircle } from "lucide-react";

export default function CitaItem({ cita, zebra, onCancelar, onVerDetalle }) {
  return (
    <tr
      className={`transition ${
        zebra ? "bg-blue-50" : "bg-white"
      } hover:bg-blue-100`}
    >
      <td className="py-3 px-4 font-semibold text-blue-900">{cita.fecha}</td>
      <td className="py-3 px-4 text-blue-900">{cita.hora}</td>
      <td className="py-3 px-4">
        {cita.motivo ? (
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-xs font-semibold">
            {cita.motivo}
          </span>
        ) : (
          <span className="italic text-slate-400">Sin motivo</span>
        )}
      </td>
      <td className="py-3 px-4 flex gap-2">
        <button
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-700 text-xs font-semibold shadow transition"
          onClick={() => onVerDetalle?.(cita)}
          title="Ver detalle"
        >
          <Eye className="w-4 h-4" /> Detalle
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-700 text-xs font-semibold shadow transition"
          onClick={() => onCancelar?.(cita)}
          title="Cancelar cita"
        >
          <XCircle className="w-4 h-4" /> Cancelar
        </button>
      </td>
    </tr>
  );
}
