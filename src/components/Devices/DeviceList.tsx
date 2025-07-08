import React, { useEffect, useState } from 'react';
import * as deviceService from '../../services/deviceService';
import { useAuth } from '../../context/AuthContext';

const DeviceList = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<any[]>([]);

  const fetchDevices = () => {
    if (user) {
      deviceService.getDevices(localStorage.getItem('token')!).then(setDevices);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [user]);

  return (
    <div>
      <h3>Devices</h3>
      <ul>
        {devices.map(device => (
          <li key={device.id}>{device.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceList; 