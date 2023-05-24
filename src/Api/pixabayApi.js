import axios from 'axios';

const API_KEY = '34961541-6d5c00c2050e86bf56b399f26';
const API_URL = 'https://pixabay.com/api/';

export const fetchImages = async (searchQuery, page) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        page: page,
        per_page: 12,
        safesearch: true,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

