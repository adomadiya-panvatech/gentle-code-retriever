import React, { useEffect, useState } from 'react';
import * as customFieldService from '../../services/customFieldService';
import { useAuth } from '../../context/AuthContext';

const CustomFieldList = () => {
  const { user } = useAuth();
  const [customFields, setCustomFields] = useState<any[]>([]);

  const fetchCustomFields = () => {
    if (user) {
      customFieldService.getCustomFields(localStorage.getItem('token')!).then(setCustomFields);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, [user]);

  return (
    <div>
      <h3>Custom Fields</h3>
      <ul>
        {customFields.map(field => (
          <li key={field.id}>{field.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomFieldList; 