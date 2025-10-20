import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Server } from 'lucide-react';
import axios from 'axios';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackend = async () => {
    try {
      await axios.get(`${API_URL.replace('/api', '')}/api/health`, { timeout: 5000 });
      setStatus('connected');
    } catch (error) {
      setStatus('disconnected');
    }
  };

  if (status === 'connected') {
    return (
      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-md z-50">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-700 font-medium">Backend Connected</span>
      </div>
    );
  }

  if (status === 'disconnected') {
    return (
      <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 max-w-md shadow-lg z-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 mb-1">Backend Server Not Running</p>
            <p className="text-xs text-red-700 mb-2">
              Please start the backend server to use the application.
            </p>
            <div className="text-xs text-red-600 bg-red-100 p-2 rounded font-mono">
              cd backend && npm install && npm run dev
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-md z-50">
      <Server className="w-4 h-4 text-blue-600 animate-pulse" />
      <span className="text-sm text-blue-700 font-medium">Checking backend...</span>
    </div>
  );
};

export default BackendStatus;
