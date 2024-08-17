import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RailwayList() {
  const [railways, setRailways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRailways();
  }, []);

  const fetchRailways = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5004/railways');
      console.log(response);
      
      if (Array.isArray(response.data)) {
        setRailways(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setRailways([]);
      }
    } catch (error) {
      console.error('Error fetching railways:', error);
      setError('Failed to load railways. Please try again.');
      setRailways([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time) => {
    return time ? new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  const deleteRailway = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/railways/${id}`);
      setRailways(prevRailways => prevRailways.filter(railway => railway._id !== id));
    } catch (error) {
      console.error('Error deleting railway:', error);
      setError('Failed to delete railway. Please try again.');
    }
  };
  return (
    <div>
      <h1>Railway List</h1>
      <Link to="/add">Add New Railway</Link>
      {railways.length > 0 ? (
        railways.map((railway) => (
          <div key={railway._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h2>
              <Link to={`/railways/${railway._id}`}>{railway.name}</Link>
            </h2>
            <h3>Trains:</h3>
            <ul>
              {railway.trains.map((train, index) => (
                <li key={index}>
                  Number: {train.trainNumber}, Type: {train.trainType}, Capacity: {train.capacity}
                </li>
              ))}
            </ul>
            <p>Stations: {railway.stations.join(', ')}</p>
            <p>Routes: {railway.routes.join(', ')}</p>
            <p>Operating Hours: {formatTime(railway.operatingHours.start)} - {formatTime(railway.operatingHours.end)}</p>
            <h3>Maintenance Schedule:</h3>
            <ul>
              {railway.maintenanceSchedule.map((schedule, index) => (
                <li key={index}>
                  Date: {new Date(schedule.date).toLocaleDateString()}, Description: {schedule.description}
                </li>
              ))}
            </ul>
            <button onClick={() => deleteRailway(railway._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No railways available.</p>
      )}
    </div>
  );
}

export default RailwayList;