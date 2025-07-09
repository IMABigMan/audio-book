import { http } from '@/utils/http'

export function getMusicList() {
  return http.get({
    url: '/json/all.json',
    showError: false,
  })
}
