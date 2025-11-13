import { useState,useEffect } from "react";
import api from "../utils/api";
const allergiesModal = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
    const timeout = setTimeout(async () => {
        if (searchTerm.length >= 2) {
        await api.get(`/api/allergies?query=${searchTerm}`)
        }
        setResults([]);
    }, 400); // debounce delay
    return () => clearTimeout(timeout);
    }, [searchTerm]);
        return(
            <>

            </>
        );
    }

export default allergiesModal;
