import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { debounce } from 'lodash';

function RailwayForm() {
  const [railway, setRailway] = useState({
    name: '',
    trains: [{ trainNumber: '', trainType: '', capacity: 0 }],
    stations: '',
    routes: '',
    operatingHours: { start: '', end: '' },
    maintenanceSchedule: []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchRailwayData = useCallback(async () => {
    if (id) {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5004/railways/${id}`);
        const fetchedData = response.data;
        setRailway({
          ...fetchedData,
          stations: fetchedData.stations.join(', '),
          routes: fetchedData.routes.join(', ')
        });
      } catch (error) {
        console.error('Error fetching railway data:', error);
        setError('Failed to load railway data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchRailwayData();
  }, [fetchRailwayData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRailway(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTrainChange = (index, field, value) => {
    const newTrains = [...railway.trains];
    newTrains[index][field] = field === 'capacity' ? parseInt(value, 10) : value;
    setRailway(prevState => ({
      ...prevState,
      trains: newTrains
    }));
  };

  const addTrain = () => {
    setRailway(prevState => ({
      ...prevState,
      trains: [...prevState.trains, { trainNumber: '', trainType: '', capacity: 0 }]
    }));
  };

  const removeTrain = (index) => {
    setRailway(prevState => ({
      ...prevState,
      trains: prevState.trains.filter((_, i) => i !== index)
    }));
  };

  const handleOperatingHoursChange = (field, value) => {
    setRailway(prevState => ({
      ...prevState,
      operatingHours: {
        ...prevState.operatingHours,
        [field]: value
      }
    }));
  };

  const addMaintenanceSchedule = () => {
    setRailway(prevState => ({
      ...prevState,
      maintenanceSchedule: [...prevState.maintenanceSchedule, { date: '', description: '' }]
    }));
  };

  const handleMaintenanceChange = (index, field, value) => {
    const newSchedule = [...railway.maintenanceSchedule];
    newSchedule[index][field] = value;
    setRailway(prevState => ({
      ...prevState,
      maintenanceSchedule: newSchedule
    }));
  };

  const removeMaintenanceSchedule = (index) => {
    setRailway(prevState => ({
      ...prevState,
      maintenanceSchedule: prevState.maintenanceSchedule.filter((_, i) => i !== index)
    }));
  };

  const debouncedSuggestions = useCallback(
    debounce((value) => {
      axios.get(`http://localhost:5001/suggestions?q=${value}`)
        .then(response => setSuggestions(response.data))
        .catch(error => console.error('Error fetching suggestions:', error));
    }, 300),
    []
  );

  const handleNameChange = (e) => {
    const { value } = e.target;
    handleChange(e);
    if (value.length > 2) {
      debouncedSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const finalRailway = {
        ...railway,
        stations: railway.stations.split(',').map(station => station.trim()),
        routes: railway.routes.split(',').map(route => route.trim())
      };
      if (id) {
        await axios.put(`http://localhost:5004/railways/${id}`, finalRailway);
      } else {
        await axios.post('http://localhost:5001/railways', finalRailway);
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting railway data:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while submitting the form. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{id ? 'Edit' : 'Add'} Railway</h1>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      <div>
        <label htmlFor="name">Railway Name:</label>
        <input
          id="name"
          name="name"
          value={railway.name}
          onChange={handleNameChange}
          required
        />
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => setRailway(prevState => ({ ...prevState, name: suggestion }))}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2>Trains</h2>
      {railway.trains.map((train, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Train Number"
            value={train.trainNumber}
            onChange={(e) => handleTrainChange(index, 'trainNumber', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Train Type"
            value={train.trainType}
            onChange={(e) => handleTrainChange(index, 'trainType', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={train.capacity}
            onChange={(e) => handleTrainChange(index, 'capacity', e.target.value)}
            required
          />
          <button type="button" onClick={() => removeTrain(index)}>Remove Train</button>
        </div>
      ))}
      <button type="button" onClick={addTrain}>Add Train</button>
      <div>
        <label htmlFor="stations">Stations (comma-separated):</label>
        <input
          id="stations"
          name="stations"
          value={railway.stations}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="routes">Routes (comma-separated):</label>
        <input
          id="routes"
          name="routes"
          value={railway.routes}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3>Operating Hours</h3>
        <label htmlFor="operatingHoursStart">Start:</label>
        <input
          id="operatingHoursStart"
          type="time"
          value={railway.operatingHours.start}
          onChange={(e) => handleOperatingHoursChange('start', e.target.value)}
          required
        />
        <label htmlFor="operatingHoursEnd">End:</label>
        <input
          id="operatingHoursEnd"
          type="time"
          value={railway.operatingHours.end}
          onChange={(e) => handleOperatingHoursChange('end', e.target.value)}
          required
        />
      </div>
      <div>
        <h3>Maintenance Schedule</h3>
        {railway.maintenanceSchedule.map((schedule, index) => (
          <div key={index}>
            <input
              type="date"
              value={schedule.date}
              onChange={(e) => handleMaintenanceChange(index, 'date', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={schedule.description}
              onChange={(e) => handleMaintenanceChange(index, 'description', e.target.value)}
              required
            />
            <button type="button" onClick={() => removeMaintenanceSchedule(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addMaintenanceSchedule}>Add Maintenance Schedule</button>
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default RailwayForm;
