import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/'

const ACCESS_TOKEN_KEY = 'scgn_access_token'
const REFRESH_TOKEN_KEY = 'scgn_refresh_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise = null

async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('Missing refresh token')

  const res = await axios.post(`${API_BASE_URL}auth/token/refresh/`, { refresh })
  const access = res?.data?.access
  if (!access) throw new Error('No access token returned')

  setTokens({ access })
  return access
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config
    const status = error?.response?.status

    if (!originalRequest || status !== 401) {
      return Promise.reject(error)
    }

    // Évite la boucle infinie si le refresh échoue.
    if (originalRequest.__isRetryRequest) {
      clearTokens()
      return Promise.reject(error)
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newAccess = await refreshPromise
      originalRequest.__isRetryRequest = true
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${newAccess}`
      return api.request(originalRequest)
    } catch (e) {
      clearTokens()
      return Promise.reject(e)
    }
  },
)

