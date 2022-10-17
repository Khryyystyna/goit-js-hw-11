import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';

const pixabay = new PixabayAPI();

const handleSubmit = async event => {
    event.preventDefault();
    const { elements: { query } } = event.currentTarget;
    const searchQuery = query.value.trim().toLowerCase();
    console.log(searchQuery);
    if (!searchQuery) {
        Notify.failure('The search field is empty');
        return;
  }
    clearPage();
    pixabay.query = searchQuery;

try {
  const { hits, total } = await pixabay.getPhotos(searchQuery);
    if (hits.length === 0) {
           Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
      return;
  }
 
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    pixabay.calculateTotalHits(total);
    refs.gallery.innerHTML = markup;
    if (pixabay.isShowLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
  }
} catch (error) {
    console.log(error);
    clearPage();
}
};

const onLoadMore = () => {
    pixabay.increment();
    if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
    pixabay.getPhotos()
        .then(({ hits, total }) => {
            const markup = createMarkup(hits);
            refs.gallery.insertAdjacentHTML('beforeend', markup);
        })
      .catch(error => {
       console.log(error);
     clearPage();
    });
 };

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixabay.resetPage();
  refs.gallery.innerHTML = '';
  // refs.loadMoreBtn.classList.add('is-hidden');
}