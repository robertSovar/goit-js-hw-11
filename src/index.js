import { getImage } from "./image-api.js";
import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.getElementById('search-form');
const submitBtn = document.querySelector('[type="submit"]');

document.addEventListener('DOMContentLoaded', () => {
    formEl.addEventListener('submit', onSubmit)

    // Submit function
    async function onSubmit(e) {
     e.preventDefault();
    const query = formEl.elements.searchQuery.value;
     const images = await getImage(query);
     console.log(images);
     createImgCards(images);
     formEl.reset();
    }
    

    // Create images function
    async function createImgCards(images) {
        const galleryDiv = document.createElement('DIV');
        galleryDiv.className = 'gallery';
       const newImg = images.map(image => {
            const imageCard = document.createElement('div');
            imageCard.innerHTML = `<div class="photo-card">
            <img src="${image.previewURL}" alt="${image.tags
            }" loading="lazy" />
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
          </div>`
          return imageCard;
        });
         newImg.forEach(card => {
            galleryDiv.appendChild(card);
         });
         document.body.appendChild(galleryDiv);
    };
});