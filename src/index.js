import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';

const pixabay = new PixabayAPI();

const handleSubmit = async event => {
    event.preventDefault();
    const { elements: { query }, } = event.currentTarget;
    const searchQuery = query.value.trim().toLowerCase();
    if (!searchQuery) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again');
        return;
    }
    clearPage();
    pixabay.query = searchQuery;

try {
  const { hits, total } = await pixabay.getPhotos();
    if (results.length === 0) {
        Notify.info('Sorry, there are no images matching your search query. Please try again');
        return;
    }
    const markup = createMarkup(hits);
    refs.galery.insertAdjacentHTML('beforeend', markup);
    pixabay.calculateTotalHits(total);

    if (pixabay.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
    }
} catch (error) {
    clearPage();
}
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
     clearPage();
    });
 };

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixabay.resetPage();
//   refs.galery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}