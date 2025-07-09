import { http } from '@/utils/http'

export function getMusicList() {
  return http.get({
    url: `${import.meta.env.VITE_BASE_URL.endsWith('/') ? import.meta.env.VITE_BASE_URL.slice(0, -1) : import.meta.env.VITE_BASE_URL}/json/all.json`,
    showError: false,
  })
}
