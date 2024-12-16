import axios from 'axios';
import { AuthResponse } from '@/types/auth';
import useAuthStore from '@/store/auth';
import { AxiosError } from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3003';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const searchMovies = async (name: string) => {
        try {
            
                const response = await api.get(`${api}/movie/search', {
                  params: { name },
                })
                return response.data;
        } catch (error) {
                console.error('Error searching movies:', error);
                throw error;
        }
};
