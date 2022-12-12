import axios from 'axios';

export class PixabayApiGallery {
  baseURL = 'https://pixabay.com/api/';
  params = {
    key: '31188352-46a7e6bf452f5b6a9df0581a7',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  };
  async getResponse(query, page, perPage) {
    if (query) {
      this.params.q = query;
      this.params.page = page;
      this.params.per_page = perPage;
    }

    const config = {
      params: this.params,
    };
    return await axios.get(this.baseURL, config);
  }
}
