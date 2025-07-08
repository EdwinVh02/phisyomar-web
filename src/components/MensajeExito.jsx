import React from "react";

export default function MensajeExito({ mensaje }) {
  return (
    <div className="text-green-600 font-semibold text-center mt-2">
      {mensaje}
    </div>
  );
}
