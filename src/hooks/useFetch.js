import { useState, useEffect, useCallback } from 'react';

export function useFetch(initialUrl) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(
        async ({ method = 'GET', url = initialUrl, body = null, headers = { 'Content-Type': 'application/json' } }) => {
            setLoading(true);
            setError(null);

            try {
                const options = {
                    method,
                    headers,
                };

                if (body) {
                    options.body = JSON.stringify(body);
                }

                const response = await fetch(url, options);
                if (!response.ok) throw new Error('Network response was not ok');

                if (method !== 'DELETE') {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    setData(null); // For DELETE requests we can set null
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        },
        [initialUrl]
    );

    const refetchData = useCallback(() => {
        if (initialUrl) {
            fetchData({ url: initialUrl });
        }
    }, [initialUrl, fetchData]);

    useEffect(() => {
        if (initialUrl) {
            fetchData({}); // Fetch data with initial URL on component mount
        }
    }, [initialUrl, fetchData]);

    return { data, loading, error, fetchData, refetchData };
}
