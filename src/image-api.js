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
          page: 1,
          per_page: 40,
        },
      });
      const totalHits = res.data.totalHits;
      if(totalHits > 0) {
         Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
      }
      else {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      }
     
      return res.data.hits;
    } catch (error) {
      error = Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
      
      throw error; 
    }
};
