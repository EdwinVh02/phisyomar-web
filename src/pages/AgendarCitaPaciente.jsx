import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CitaForm from "../components/CitaForm";
import MensajeExito from "../components/MensajeExito";

export default function AgendarCitaPaciente() {
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(form, resetForm) {
    // Aquí iría la lógica real para guardar la cita
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      navigate("/mis-citas"); // Redirige después de mostrar el mensaje
    }, 2000); // Espera 2 segundos, cambia si quieres
    resetForm({ paciente: "", fecha: "", hora: "", motivo: "" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg mx-auto bg-white border shadow-xl rounded-2xl p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <CalendarCheck className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Agendar Cita</h2>
        </div>
        <p className="text-slate-500">
          Completa el siguiente formulario para solicitar una cita médica. Recibirás confirmación pronto.
        </p>
        <CitaForm onSubmit={handleSubmit} />
        {enviado && (
          <MensajeExito mensaje="¡Tu cita ha sido solicitada con éxito!" />
        )}
      </div>
    </div>
  );
}
