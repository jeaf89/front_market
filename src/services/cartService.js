import axios from 'axios';
export const getCart = async (id) => {
    try {
        // const response = await axios.get(`http://localhost:3000/cart/${id}`);
        const response = await axios.get(`https://artmarketback.onrender.com/cart/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el carro de compras:', error);
        throw error;
    }
};
