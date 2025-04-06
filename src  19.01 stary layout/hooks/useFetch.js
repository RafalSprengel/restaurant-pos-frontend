import { useState, useEffect } from 'react';
import api from '../utils/axios';

export function useFetch(initialUrl) {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);

     const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
               const response = await api(initialUrl);
               setData(response.data);
          } catch {
               setError('Network connection error');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (initialUrl) {
               fetchData();
          }
     }, [initialUrl]);

     return { data, loading, error, refetch: fetchData };
}
