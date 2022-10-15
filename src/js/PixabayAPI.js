// import axios from 'axios';

// axios.defaults.baseURL = 'https://pixabay.com/api/';
// // axios.defaults.headers.common['Authorization'] =
// //   'API key 30567528-24ce7a845f498c2eba342043e';

export class PixabayAPI {
  #page = 1;
  #totalHits = 0;
  #perPage = 20;
  #query = '';
  // #params = {
  //   params: {
  //     imageType: "photo",
  //     orientation: "horizontal",
  //     safeSearch: "true",
  //     key:'30567528-24ce7a845f498c2eba342043e',
  //   }
  

  async getPhotos() {
    const key = '30567528-24ce7a845f498c2eba342043e';
    const imageType = "photo";
    const orientation = "horizontal";
    const safeSearch = "true";

    // const urlAxios = `?q=${this.#query}&pretty=true&page=${this.#page}&tottal_hits=${this.#totalHits}&per_page=${this.#perPage}`;

    // const { data } = await axios.get(urlAxios, this.#params);
    // return data;

    const url = `https://pixabay.com/api/?key=${key}&q=${this.#query}&image_type=${imageType}&pretty=true&orientation=${orientation}&safe_search=${safeSearch}&page=${this.#page}&tottal_hits=${this.#totalHits}&per_page=${this.#perPage}`;

    let response = await fetch(url);
    let data = await response.json();
    console.log(response, data);
    return { results: data };
  }

  set query(newQuery) {
    this.#page = newQuery;
  }

  get query() {
    return this.#page;
  }

  increment() {
    this.#page += 1 
  }
  
    resetPage() {
    this.#page = 1;
  }

   get isShowLoadMore() {
    return this.#page < this.#totalHits;
  }

  calculateTotalHits(total) {
    this.#totalHits = Math.ceil(total / this.#perPage);
  }
};

