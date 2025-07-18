import { useState, useEffect } from 'react';
import { testEndpoint } from '../utils/debug';

export default function TerapeutasTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const results = {};
      
      // Test 1: Endpoint directo
      try {
        const directResult = await testEndpoint('http://localhost:8000/api/terapeutas-publico');
        results.direct = { success: true, data: directResult };
      } catch (error) {
        results.direct = { success: false, error: error.message };
      }

      // Test 2: Con fetch
      try {
        const fetchResponse = await fetch('http://localhost:8000/api/terapeutas-publico');
        const fetchData = await fetchResponse.json();
        results.fetch = { success: true, data: fetchData };
      } catch (error) {
        results.fetch = { success: false, error: error.message };
      }

      // Test 3: Con axios
      try {
        const axios = (await import('axios')).default;
        const axiosResponse = await axios.get('http://localhost:8000/api/terapeutas-publico');
        results.axios = { success: true, data: axiosResponse.data };
      } catch (error) {
        results.axios = { success: false, error: error.message };
      }

      setTestResults(results);
      setLoading(false);
    };

    runTests();
  }, []);

  if (loading) {
    return <div className="p-4">Ejecutando tests...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-4">Diagnóstico de Terapeutas</h3>
      
      {Object.entries(testResults).map(([test, result]) => (
        <div key={test} className="mb-4 p-3 border rounded">
          <h4 className="font-semibold">Test: {test}</h4>
          {result.success ? (
            <div className="text-green-600">
              ✅ Éxito: {JSON.stringify(result.data, null, 2)}
            </div>
          ) : (
            <div className="text-red-600">
              ❌ Error: {result.error}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}