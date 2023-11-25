import axios from "axios";
import Notiflix from "notiflix";

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '40885612-70f55eeefc8db6341de76fae5';


// getting images from server
export async function getImage(query) {
    try {
      const res = await axios.get(ENDPOINT, {
        params: {
          key: API_KEY,
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
        },
      });
  
      return res.data.hits;
    } catch (error) {
      error = Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
      
      throw error; 
    }
};
