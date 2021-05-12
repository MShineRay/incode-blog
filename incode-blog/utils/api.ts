import axios, { AxiosInstance } from 'axios'

const createApi = (baseURL: string) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    headers,
  })

  const createRequest =
    method =>
    async (url: string, data, { ...config } = {}) => {
      const response = await axiosInstance({
        method,
        url,
        data,
        headers: {
          ...config.headers,
        },
        ...config,
      })
      return {
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        data: response.data,
      }
    }

  return {
    get: createRequest('GET'),
    post: createRequest('POST'),
    put: createRequest('PUT'),
    delete: createRequest('DELETE'),
  }
}

const api = createApi(process.env.BASE_URL)

export default api
