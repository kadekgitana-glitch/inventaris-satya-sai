import { useState, useEffect } from 'react';
import dataService from '../services/dataService';

export function useData(collection) {
  const [data, setData] = useState(() => dataService.getAll(collection));

  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail === collection) {
        setData(dataService.getAll(collection));
      }
    };
    
    // Listen for real-time updates from dataService
    window.addEventListener('data-sync', handleSync);
    
    return () => {
      window.removeEventListener('data-sync', handleSync);
    };
  }, [collection]);

  return [data, setData];
}
