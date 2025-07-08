import React from "react";
import CitaItem from "./CitaItem";
import { CalendarDays, Clock4, MessageCircle, MoreHorizontal } from "lucide-react";

export default function CitasTabla({ citas, onCancelar, onVerDetalle }) {
  if (!citas || citas.length === 0) {
    return (
      <div className="w-full flex flex-col items-center py-16 rounded-2xl shadow bg-white border">
        <p className="text-slate-400 text-lg">No tienes citas agendadas.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-3xl border shadow-2xl p-2 sm:p-6">
      <table className="w-full min-w-[480px] text-left rounded-2xl overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-blue-900 text-base border-b">
            <th className="py-4 px-4 font-bold">
              <div className="flex flex-col items-center gap-1">
                <CalendarDays className="w-5 h-5 text-blue-500 mb-1" />
                <span>Fecha</span>
              </div>
            </th>
            <th className="py-4 px-4 font-bold">
              <div className="flex flex-col items-center gap-1">
                <Clock4 className="w-5 h-5 text-blue-500 mb-1" />
                <span>Hora</span>
              </div>
            </th>
            <th className="py-4 px-4 font-bold">
              <div className="flex flex-col items-center gap-1">
                <MessageCircle className="w-5 h-5 text-blue-600 mb-1" />
                <span>Motivo</span>
              </div>
            </th>
            <th className="py-4 px-4 font-bold">
              <div className="flex flex-col items-center gap-1">
                <MoreHorizontal className="w-5 h-5 text-blue-400 mb-1" />
                <span>Acciones</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita, idx) => (
            <CitaItem
              key={cita.id}
              cita={cita}
              zebra={idx % 2 === 1}
              onCancelar={onCancelar}
              onVerDetalle={onVerDetalle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
