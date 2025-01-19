import { useState, useEffect, useCallback, useRef } from 'react';

export function useFetch(initialUrl) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);
    const firstRender = useRef(true); // Ref to track first render

    const fetchData = useCallback(
        async (url = initialUrl) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url, { credentials: 'include' });
                // if (!response.ok) throw new Error('Network response was not ok');
                const res = await response.json();
                if (!response.ok) setError(res.error);
                setResponseStatus(response.status);
                setData(res);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        },
        [initialUrl]
    );

    const refetch = useCallback(() => {
        if (initialUrl) {
            fetchData(initialUrl);
        }
    }, [initialUrl, fetchData]);

    useEffect(() => {
        // Avoid the first fetch if already done
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (initialUrl) {
            fetchData();
        }
    }, [initialUrl, fetchData]);

    useEffect(() => {
        // Initial fetch on component mount
        if (firstRender.current && initialUrl) {
            fetchData();
        }
    }, [initialUrl, fetchData]);

    return { data, loading, error, refetch, fetchData, responseStatus };
}
