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

function pickFirstString(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const first = value.find((v) => typeof v === 'string')
    return first ?? null
  }
  return null
}

function flattenErrors(data) {
  // DRF errors: { field: ["msg"] } or { detail: "..." }
  if (!data || typeof data !== 'object') return []
  const out = []
  for (const [key, val] of Object.entries(data)) {
    const msg = pickFirstString(val)
    if (msg) out.push(`${key}: ${msg}`)
  }
  return out
}

export function getApiErrorMessage(err) {
  // Erreur réseau / CORS / DNS / API down
  if (!err?.response) {
    const base = API_BASE_URL
    return `Impossible de contacter l’API. Vérifie que l’API est en ligne et que VITE_API_BASE_URL est correcte.\nAPI: ${base}`
  }

  const status = err.response.status
  const data = err.response.data

  const detail =
    pickFirstString(data?.detail) ||
    pickFirstString(data?.non_field_errors) ||
    pickFirstString(data?.first_name) ||
    pickFirstString(data?.last_name) ||
    pickFirstString(data?.username) ||
    pickFirstString(data?.email) ||
    pickFirstString(data?.password) ||
    pickFirstString(data?.password_confirm) ||
    pickFirstString(data) ||
    null

  if (detail) return `Erreur ${status}: ${detail}`

  const flattened = flattenErrors(data)
  if (flattened.length) return `Erreur ${status}:\n- ${flattened.join('\n- ')}`

  return `Erreur ${status}: requête refusée.`
}

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

