import { useEffect, useState } from 'react';

/**
 * Custom hook that manages data in localStorage and validates products by checking if they still exist in the database.
 * If a product no longer exists, it is removed from the state and localStorage.
 */
export function useLocalStorageWithValidation(key, initialValue) {
    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue);

        if (typeof initialValue === 'function') {
            return initialValue();
        } else {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    // Function to validate if products still exist in the database
    const validateProducts = async () => {
        const updatedValue = [];
        for (const item of value) {
            try {
                // Check if the product exists in the database
                const response = await fetch(`http://localhost:3001/api/getSingleProduct/${item._id}`);
                if (response.ok) {
                    const product = await response.json();
                    if (product) {
                        updatedValue.push(item); // Product exists, add to updated list
                    }
                } else {
                    console.error(`Product with ID ${item._id} does not exist in the database.`);
                }
            } catch (error) {
                console.error(`Error validating product with ID ${item._id}:`, error);
            }
        }

        // Update state and localStorage with only the existing products
        setValue(updatedValue);
    };

    useEffect(() => {
        if (Array.isArray(value) && value.length > 0) {
            validateProducts();
        }
    }, []);
    return [value, setValue];
}
