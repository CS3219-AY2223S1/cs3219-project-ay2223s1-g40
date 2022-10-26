import axios from "axios";

const axiosClientUserService = axios.create({
  baseURL: "http://localhost:8000/api/user",
});

const requests = (api) => {
  return {
    get: (url) => {
      return api.get(url);
    },
    post: (url, data, token) => {
      if (token) {
        return api.post(url, data, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      }
      return api.post(url, data);
    },
    patch: (url, data, token) => {
      return api.patch(url, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    },
    delete: (url, token) => {
      return api.delete(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    },
  };
};

const clientUserService = requests(axiosClientUserService);
export { clientUserService };
