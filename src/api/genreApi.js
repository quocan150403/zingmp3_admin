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
  getById: (id) => {
    const url = `genres/${id}`;
    return axiosClient.get(url);
  },
  getBySlug: (slug) => {
    const url = 'genres';
    return axiosClient.get(url, { slug });
  },
  add: (data) => {
    const url = 'genres/store';
    return axiosClient.post(url, data);
  },
  edit: (id, data) => {
    const url = `genres/update/${id}`;
    return axiosClient.put(url, data);
  },
  delete: (id) => {
    const url = `genres/delete/${id}`;
    return axiosClient.delete(url);
  },
  deleteAll: (data) => {
    const url = 'genres/delete';
    return axiosClient.delete(url, data);
  },
};
export default genreApi;
