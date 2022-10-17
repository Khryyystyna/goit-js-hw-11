import './css/styles.css';
import Notiflix from 'notiflix';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');

const pixabay = new PixabayAPI();

const handleSubmit = async event => {
    event.preventDefault();
    const { elements: { query } } = event.currentTarget;
    const searchQuery = query.value.trim().toLowerCase();
    if (!searchQuery) {
        Notiflix.Notify.failure('The search field is empty');
        return;
  }
  clearPage();
  lightbox.refresh();
    pixabay.query = searchQuery;

try {
  const { hits, total } = await pixabay.getPhotos(searchQuery);
    if (hits.length === 0) {
           Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
      return;
  }
  Notiflix.Notify.success(`Hooray! We found ${total} images`);
   
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    pixabay.calculateTotalHits(total);
    refs.gallery.innerHTML = markup;
    lightbox.refresh();
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
}