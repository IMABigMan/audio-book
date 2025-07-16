import { http } from '@/utils/http'

// 播放列表类型
export type PlaylistType = 'all' | 'local'

// 获取所有音乐列表
export function getMusicList() {
  return http.get({
    url: `${import.meta.env.VITE_BASE_URL.endsWith('/') ? import.meta.env.VITE_BASE_URL.slice(0, -1) : import.meta.env.VITE_BASE_URL}/json/all.json`,
    showError: false,
  })
}

// 获取本地音乐列表
export function getLocalMusicList() {
  return http.get({
    url: `${import.meta.env.VITE_BASE_URL.endsWith('/') ? import.meta.env.VITE_BASE_URL.slice(0, -1) : import.meta.env.VITE_BASE_URL}/json/local.json`,
    showError: false,
  })
}

// 根据类型获取播放列表
export function getPlaylistByType(type: PlaylistType) {
  switch (type) {
    case 'all':
      return getMusicList()
    case 'local':
      return getLocalMusicList()
    default:
      return getMusicList()
  }
}
