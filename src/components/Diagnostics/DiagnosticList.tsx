import React, { useEffect, useState } from 'react';
import * as diagnosticService from '../../services/diagnosticService';
import { useAuth } from '../../context/AuthContext';

const DiagnosticList = () => {
  const { user } = useAuth();
  const [diagnostics, setDiagnostics] = useState<any[]>([]);

  const fetchDiagnostics = () => {
    if (user) {
      diagnosticService.getDiagnostics(localStorage.getItem('token')!).then(setDiagnostics);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, [user]);

  return (
    <div>
      <h3>Diagnostics</h3>
      <ul>
        {diagnostics.map(diagnostic => (
          <li key={diagnostic.id}>{diagnostic.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DiagnosticList; 