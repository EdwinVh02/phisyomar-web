import React, { useState } from "react";

export default function CitaForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    paciente: "",
    fecha: "",
    hora: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(form, setForm); // Pasa también setForm para limpiar si lo deseas arriba
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Agendar nueva cita</h3>
      <input
        className="border rounded-lg px-3 py-2"
        name="paciente"
        placeholder="Nombre del paciente"
        value={form.paciente}
        onChange={handleChange}
        required
      />
      <input
        className="border rounded-lg px-3 py-2"
        name="fecha"
        type="date"
        value={form.fecha}
        onChange={handleChange}
        required
      />
      <input
        className="border rounded-lg px-3 py-2"
        name="hora"
        type="time"
        value={form.hora}
        onChange={handleChange}
        required
      />
      <div className="flex gap-2 justify-end">
        {onClose && (
          <button
            type="button"
            className="px-4 py-2 rounded-lg border text-slate-500"
            onClick={onClose}
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          Guardar
        </button>
      </div>
    </form>
  );
}
