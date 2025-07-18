import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <ShieldX className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso Denegado
            </h1>
            <p className="text-gray-600">
              No tienes permisos para acceder a esta página.
            </p>
          </div>
          
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}