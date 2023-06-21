import { useState, useEffect } from 'react';

const useSessionStorageState = ({ name, initialValue } : any) => {
    const [value, setValue] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedValue = sessionStorage.getItem(name);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        }
    });

    useEffect(() => {
        sessionStorage.setItem(name, JSON.stringify(value));
    }, [name, value]);

    return [value, setValue];
}

export default useSessionStorageState;
