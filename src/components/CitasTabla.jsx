import React from "react";
import CitaItem from "./CitaItem";
import { CalendarDays, Clock4, MessageCircle, MoreHorizontal, CalendarX, Plus } from "lucide-react";

export default function CitasTabla({ citas, onCancelar, onVerDetalle }) {
  if (!citas || citas.length === 0) {
    return (
      <div className="w-full flex flex-col items-center py-20 bg-white">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <CalendarX className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes citas agendadas</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Cuando tengas citas programadas, aparecerán aquí. ¡Agenda tu primera cita para comenzar!
        </p>
        <button
          onClick={() => window.location.href = '/paciente/agendar-cita'}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agendar Primera Cita
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[768px] text-left">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="py-4 px-6 font-semibold">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>Fecha</span>
                </div>
              </th>
              <th className="py-4 px-6 font-semibold">
                <div className="flex items-center gap-2">
                  <Clock4 className="w-5 h-5" />
                  <span>Hora</span>
                </div>
              </th>
              <th className="py-4 px-6 font-semibold">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Motivo & Estado</span>
                </div>
              </th>
              <th className="py-4 px-6 font-semibold">
                <div className="flex items-center gap-2">
                  <MoreHorizontal className="w-5 h-5" />
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
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
    </div>
  );
}
