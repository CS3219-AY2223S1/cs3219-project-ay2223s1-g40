import axios from "axios";

const axiosClientUserService = axios.create({
  baseURL: "http://localhost:8000/api/user",
});

const requests = (api: any) => {
  return {
    get: (url: string, token?: string) => {
      return api.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    },
    post: (url: string, data: object, token?: string) => {
      if (token) {
        return api.post(url, data, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      }
      return api.post(url, data);
    },
    patch: (url: string, data: object, token?: string) => {
      return api.patch(url, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    },
    delete: (url: string, token?: string) => {
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
