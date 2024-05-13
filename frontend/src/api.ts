import axios from "axios";

const api = axios.create({
    baseURL: 'http://127.0.0.1:3000',
});

export const register = async (data: {email: string, password: string}) => {
    try {
        const response = await api.post('/guest/register', data);
        return response.data.token
    } catch(error: any) {
        error.stack = error.response.data
        throw error
    }
};

export const login = async (data: {email: string, password: string}) => {
    try {
        const response = await api.post('/guest/login', data);
        return response.data.token
    } catch(error: any) {
        error.stack = error.response.data
        throw error
    }
};

export const employeeLogin = async (data: {email: string, password: string}) => {
    try {
        const response = await api.post('/employee/login', data);
        return response.data.token
    } catch(error: any) {
        error.stack = error.response.data
        throw error
    }
};

export default api;