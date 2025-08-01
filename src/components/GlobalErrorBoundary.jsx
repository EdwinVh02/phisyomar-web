import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Date.now().toString();
    
    this.setState({
      error,
      errorInfo,
      errorId
    });
    
    // Log error para monitoreo
    console.error('🚨 Global Error Boundary:', {
      errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // En producción, enviar error a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(error, errorInfo, errorId);
    }
  }

  reportErrorToService = async (error, errorInfo, errorId) => {
    try {
      // Simular envío a servicio de monitoreo (ej: Sentry, LogRocket)
      const errorReport = {
        id: errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null
      };

      // Aquí iría la llamada real al servicio de monitoreo
      console.log('Error report ready for monitoring service:', errorReport);
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4">
          <div className="max-w-2xl w-full bg-white shadow-2xl rounded-xl p-8 text-center">
            {/* Icono de Error */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <AlertTriangle className="h-20 w-20 text-red-500" />
                <div className="absolute -top-1 -right-1 bg-red-100 rounded-full p-2">
                  <Bug className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
            
            {/* Título y Mensaje */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Ups! Algo salió mal
            </h1>
            
            <p className="text-gray-600 mb-6 text-lg">
              Hemos detectado un error inesperado en la aplicación. 
              Nuestro equipo ha sido notificado automáticamente.
            </p>

            {/* ID del Error */}
            {this.state.errorId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">ID del Error:</p>
                <code className="text-sm font-mono text-gray-800 bg-gray-200 px-2 py-1 rounded">
                  {this.state.errorId}
                </code>
              </div>
            )}
            
            {/* Botones de Acción */}
            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="h-5 w-5" />
                Intentar de nuevo
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Ir al inicio
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recargar
                </button>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-500 mb-2">
                Si el problema persiste, contacta a soporte:
              </p>
              <div className="space-y-1">
                <a 
                  href="mailto:soporte@phisyomar.com" 
                  className="text-blue-600 hover:underline text-sm"
                >
                  soporte@phisyomar.com
                </a>
                <p className="text-gray-400 text-xs">
                  Incluye el ID del error para un diagnóstico más rápido
                </p>
              </div>
            </div>
            
            {/* Detalles del Error (solo en desarrollo) */}
            {isDevelopment && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                  🔧 Detalles técnicos (desarrollo)
                </summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 mb-1">Error:</h4>
                    <pre className="text-xs bg-red-50 border border-red-200 p-3 rounded overflow-auto max-h-32 text-red-800">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-orange-600 mb-1">Stack Trace:</h4>
                    <pre className="text-xs bg-orange-50 border border-orange-200 p-3 rounded overflow-auto max-h-40 text-orange-800">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  
                  {this.state.errorInfo && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-600 mb-1">Component Stack:</h4>
                      <pre className="text-xs bg-blue-50 border border-blue-200 p-3 rounded overflow-auto max-h-32 text-blue-800">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;