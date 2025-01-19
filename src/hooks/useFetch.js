import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/axios';

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
                const response = await api(url);
                if (!response.status === 200) setError(response.data.error);
                setResponseStatus(response.status);
                setData(response.data);
            } catch (error) {
                setError("Network connection error");
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
        if (firstRender.current && initialUrl) {
            fetchData();
        }
    }, [initialUrl, fetchData]);

    return { data, loading, error, refetch, fetchData, responseStatus };
}
