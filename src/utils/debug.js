// Utilidades de debug para desarrollo
export const logAPICall = (endpoint, data, error = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 API Call: ${endpoint}`);
    if (data) {
      console.log('✅ Data:', data);
    }
    if (error) {
      console.error('❌ Error:', error);
    }
    console.groupEnd();
  }
};

export const testEndpoint = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ ${url} - Status: ${response.status}`, data);
    return data;
  } catch (error) {
    console.error(`❌ ${url} - Error:`, error);
    throw error;
  }
};