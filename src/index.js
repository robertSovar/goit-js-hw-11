import { getImage } from "./image-api.js";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.getElementById('search-form');
const galleryDiv = document.createElement('DIV');
galleryDiv.className = 'gallery';

let currentPage = 1;
let endOfPage = false;

document.addEventListener('DOMContentLoaded', () => {
  formEl.addEventListener('submit', onSubmit);
  window.addEventListener('scroll', function () {
    if (endOfPage) return;
  
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.body.scrollHeight;
  
    if (scrollPosition >= pageHeight - 500) {
      const searchQuery = formEl.searchQuery.value;
      if (searchQuery) {
        loadMoreImages(searchQuery);
      }
    }
  });
});



// Submit function
async function onSubmit(e) {
  e.preventDefault();
  galleryDiv.innerHTML = '';
  currentPage = 1;
  endOfPage = false;
  const query = formEl.elements.searchQuery.value.trim();

  if (!query) {
    Notiflix.Notify.warning('Please enter a search term.');
    return;
  }

  if (query) {
    galleryDiv.innerHTML = '';
    currentPage = 1;
    try {
      const response = await getImage(query, currentPage);
      

      if (response.hits === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createImgCards(response);
        currentPage++;
      }
    } catch (error) {
      console.error(error);
    }
  }
}


// Create images function
async function createImgCards(images) {
  const newImg = await Promise.all(images.map(image => {
    const imageCard = document.createElement('div');
    imageCard.innerHTML = `<div class="photo-card">
        <a href="${image.largeImageURL}" data-lightbox="gallery">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${image.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${image.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${image.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${image.downloads}</b>
          </p>
        </div>
      </div>`;
    return imageCard;
  }));

  newImg.forEach(card => {
    galleryDiv.appendChild(card);
  });

  document.body.appendChild(galleryDiv);
  createCarousel();
}

// Carousel simplelightbox function
function createCarousel() {
  const lightbox = new SimpleLightbox('.gallery a', {});
}

async function loadMoreImages(query) {
  try {
    endOfPage = true;
    const response = await getImage(query, currentPage);
    

    if (response.hits === 0) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      createImgCards(response);
      currentPage++;
      // Calculează înălțimea unei cărți
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      // Calculează cât de mult să facem scroll în jos (de exemplu, 2 cărți înălțime)
      const scrollAmount = cardHeight * 1;

      // Face scroll fluid către partea de jos a galeriei
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    endOfPage = false;
  }
}