import React, { useState } from "react";
import CitasTabla from "../components/CitasTabla";

export default function MisCitasPage() {
  // Simulación de citas agendadas
  const [citas, setCitas] = useState([
    {
      id: 1,
      fecha: "2025-07-08",
      hora: "10:00 AM",
      motivo: "Chequeo general"
    },
    {
      id: 2,
      fecha: "2025-07-10",
      hora: "09:00 AM",
      motivo: "Dolor de cabeza"
    }
  ]);

  // Lógica para cancelar cita
  function handleCancelarCita(cita) {
    if (window.confirm("¿Seguro que deseas cancelar esta cita?")) {
      setCitas((prev) => prev.filter((c) => c.id !== cita.id));
    }
  }

  // Lógica para ver detalle (puedes abrir modal, alerta, etc)
  function handleVerDetalle(cita) {
    alert(
      `Detalle de cita:\nFecha: ${cita.fecha}\nHora: ${cita.hora}\nMotivo: ${cita.motivo || "Sin motivo"}`
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Mis citas agendadas</h2>
      <div className="w-full max-w-2xl">
        <CitasTabla
          citas={citas}
          onCancelar={handleCancelarCita}
          onVerDetalle={handleVerDetalle}
        />
      </div>
    </div>
  );
}
