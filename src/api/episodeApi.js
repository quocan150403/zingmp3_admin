import axiosClient from './axiosClient';

const url = 'episodes';

const genreApi = {
  getQuery: (params) => axiosClient.get(url, { params }),
  getAll: () => axiosClient.get(url),
  getById: (id) => axiosClient.get(`${url}/${id}`),
  getBySlug: (slug) => axiosClient.get(url, { slug }),
  getTrash: () => axiosClient.get(`${url}/trash`),
  add: (data) =>
    axiosClient.post(`${url}/store`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  addSingle: (data) => axiosClient.post(`${url}/store-single`, data),
  edit: (id, data) => axiosClient.put(`${url}/update/${id}`, data),
  delete: (id) => axiosClient.delete(`${url}/delete/${id}`),
  deleteMany: (ids) => axiosClient.post(`${url}/delete-many`, ids),
  restore: (id) => axiosClient.patch(`${url}/restore/${id}`),
  forceDelete: (id) => axiosClient.delete(`${url}/force/${id}`),
};

export default genreApi;
