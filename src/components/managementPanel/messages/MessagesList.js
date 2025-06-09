import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch.js';
import api from '../../../utils/axios.js';
import { useAuth } from '../../../context/authContext.js';

const MessagesList = () => {
    return(
        <>
        Mesages List
        </>
    )
};




export default MessagesList;