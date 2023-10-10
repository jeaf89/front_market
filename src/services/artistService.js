import axios from "axios";

// Función para obtener los verified_artists desde el backend
export const getVerifiedArtists = async () => {
    try {
        // const response = await axios.get('http://localhost:3000/artist');
        const response = await axios.get('https://artmarketback.onrender.com/artist');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los artistas verificados:', error);
        throw error;
    }
};