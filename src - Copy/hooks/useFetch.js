import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
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
                // if (!response.ok) throw new Error('Network response was not ok');

                if (!response.status === 200) setError(response.data.error);
                setResponseStatus(response.status);
                setData(response.data);
            } catch (error) {
                setError(error.response.data.error);
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
