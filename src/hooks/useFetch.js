import { useState, useEffect } from 'react';
import api from '../utils/axios';

export function useFetch(initialUrl, initialData = null) {
     const [data, setData] = useState(initialData);
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState(null);

     const fetchData = async () => {
          setIsLoading(true);
          setError(null);
          try {
               const response = await api(initialUrl);
               setData(response.data);
          } catch {
               setError('Network connection error');
          } finally {
               setIsLoading(false);
          }
     };

     useEffect(() => {
          if (initialUrl) {
               fetchData();
          }
     }, [initialUrl]);

     return { data, isLoading, error, refetch: fetchData };
}
