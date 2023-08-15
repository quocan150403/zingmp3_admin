import axiosClient from './axiosClient';

const url = 'albums';

const albumApi = {
  getQuery: (params) => axiosClient.get(url, { params }),
  getAll: () => axiosClient.get(`${url}/all`),
  getById: (id) => axiosClient.get(`${url}/${id}`),
  getBySlug: (slug) => axiosClient.get(url, { slug }),
  getTrash: () => axiosClient.get(`${url}/trash`),
  add: (data) =>
    axiosClient.post(`${url}/store`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  update: (id, data) =>
    axiosClient.put(`${url}/update/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  delete: (id) => axiosClient.delete(`${url}/delete/${id}`),
  deleteMany: (ids) =>
    axiosClient.delete(`${url}/delete-many`, {
      data: {
        ids,
      },
    }),
  restore: (id) => axiosClient.patch(`${url}/restore/${id}`),
  forceDelete: (id, oldImage) =>
    axiosClient.delete(`${url}/force/${id}`, {
      data: { oldImage },
    }),
  forceDeleteMany: (ids, imageList) =>
    axiosClient.delete(`${url}/force-many`, {
      data: {
        ids,
        imageList,
      },
    }),
};

export default albumApi;
