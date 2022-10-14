import Notiflix from 'notiflix';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';

const pixabay = new PixabayAPI();

const handleSubmit = event => {
    event.preventDefault();

    const { elements: { query }, } = event.currentTarget;
    const searchQuery = query.value.trim().toLowerCase();
    if (!searchQuery) {
        return;
    }
    
    pixabay.query = searchQuery;

    pixabay.getPhotos()
        .then(({ results }) => {
            const markup = createMarkup(results);
            refs.galery.insertAdjacentHTML('beforeend', markup);
        });
};


const onLoadMore = () => {
    pixabay.increment();

    if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

    pixabay.getPhotos()
        .then(({ results }) => {
            const markup = createMarkup(results);
            refs.galery.insertAdjacentHTML('beforeend', markup);
        })
     .catch(error => {
      Notify.failure(error.message, 'Щось пішло не так!');
    });
 };

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

