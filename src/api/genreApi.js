import axiosClient from './axiosClient';

const genreApi = {
  getQuery: (params) => {
    const url = 'genres';
    return axiosClient.get(url, { params });
  },
  getAll: () => {
    const url = 'genres';
    return axiosClient.get(url);
  },
  getOne: (id) => {
    const url = `genres/${id}`;
    return axiosClient.get(url);
  },
  getBySlug: (slug) => {
    const url = 'genres';
    return axiosClient.get(url, { slug });
  },
};
export default genreApi;
