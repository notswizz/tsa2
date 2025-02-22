import { useState, useEffect } from 'react';

export const useStaffData = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      if (!res.ok) throw new Error('Failed to fetch staff');
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      setError('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const updateStaff = (updatedStaff) => {
    setStaff(prev => prev.map(s => 
      s._id === updatedStaff._id ? updatedStaff : s
    ));
  };

  const addStaff = (newStaff) => {
    setStaff(prev => [...prev, newStaff]);
  };

  const deleteStaff = (staffId) => {
    setStaff(prev => prev.filter(s => s._id !== staffId));
  };

  return {
    staff,
    loading,
    error,
    updateStaff,
    addStaff,
    deleteStaff,
    refreshStaff: fetchStaff
  };
}; 