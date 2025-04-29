import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Device } from '../types/device.types';
import RegisterTable from '../components/devices/RegisterTable';
import api from '../services/api';

const DeviceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [device, setDevice] = useState<Device | null>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch device details
  useEffect(() => {
    const fetchDevice = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const deviceData = await api.getDeviceById(id);
        setDevice(deviceData);
        // Initial read of registers if the device is enabled
        if (deviceData.enabled) {
          await readRegisters();
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch device');
        console.error('Error fetching device:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  const readRegisters = async () => {
    if (!id) return;

    try {
      setRefreshing(true);
      const data = await api.readDeviceRegisters(id);
      setReadings(data.readings || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to read registers');
      console.error('Error reading registers:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const testConnection = async () => {
    if (!id) return;

    try {
      setRefreshing(true);
      const result = await api.testDeviceConnection(id);
      if (result.success) {
        setError(null);
        // Read registers after successful connection test
        await readRegisters();
      } else {
        setError(result.message || 'Connection test failed');
      }
    } catch (err: any) {
      setError(err.message || 'Connection test failed');
      console.error('Error testing connection:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBack = () => {
    navigate('/devices');
  };

  const handleEdit = () => {
    navigate(`/devices/edit/${id}`);
  };

  if (loading) {
    return <div className='loading'>Loading device details...</div>;
  }

  if (error && !device) {
    return (
      <div className='error-container'>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleBack}>Back to Devices</button>
      </div>
    );
  }

  if (!device) {
    return (
      <div className='not-found'>
        <h2>Device Not Found</h2>
        <button onClick={handleBack}>Back to Devices</button>
      </div>
    );
  }

  return (
    <div className='device-details-page'>
      <div className='header-actions'>
        <button onClick={handleBack}>Back</button>
        <h1>{device.name}</h1>
        <button onClick={handleEdit}>Edit</button>
      </div>

      <div className='device-info'>
        <div className='info-group'>
          <p>
            <strong>IP Address:</strong> {device.ip}
          </p>
          <p>
            <strong>Port:</strong> {device.port}
          </p>
          <p>
            <strong>Slave ID:</strong> {device.slaveId}
          </p>
          <p>
            <strong>Status:</strong> {device.enabled ? 'Enabled' : 'Disabled'}
          </p>
          {device.lastSeen && (
            <p>
              <strong>Last Seen:</strong>{' '}
              {new Date(device.lastSeen).toLocaleString()}
            </p>
          )}
        </div>

        <div className='action-buttons'>
          <button
            onClick={testConnection}
            disabled={refreshing || !device.enabled}
          >
            Test Connection
          </button>
          <button
            onClick={readRegisters}
            disabled={refreshing || !device.enabled}
          >
            {refreshing ? 'Reading...' : 'Read Registers'}
          </button>
        </div>

        {error && (
          <div className='error-message'>
            <p>{error}</p>
          </div>
        )}
      </div>

      <h2>Registers</h2>
      {device.registers && device.registers.length > 0 ? (
        <>
          <h3>Configuration</h3>
          <table className='register-config'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Length</th>
                <th>Scale Factor</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {device.registers.map((register, index) => (
                <tr key={index}>
                  <td>{register.name}</td>
                  <td>{register.address}</td>
                  <td>{register.length}</td>
                  <td>{register.scaleFactor || 1}</td>
                  <td>{register.unit || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {readings.length > 0 && (
            <>
              <h3>Current Readings</h3>
              <RegisterTable readings={readings} />
            </>
          )}
        </>
      ) : (
        <p>No registers configured for this device.</p>
      )}
    </div>
  );
};

export default DeviceDetails;
