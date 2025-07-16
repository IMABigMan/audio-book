<script setup lang="ts" generic="T extends any, O extends any">
import { getPlaylistByType, type PlaylistType } from '@/api'
import AudioPlaylist from '@/components/AudioPlaylist.vue'

interface AudioItem {
  sort: number
  title: string
  src: string
  cover?: string
}

defineOptions({
  name: 'IndexPage',
})

const musicList = ref<AudioItem[]>([])
const currentPlaylistType = ref<PlaylistType>('all')
const isLoading = ref(false)

async function fetchMusicList(type: PlaylistType = 'all') {
  try {
    isLoading.value = true
    const res = await getPlaylistByType(type)
    const list = res.data.map((item: AudioItem, index: number) => {
      return {
        sort: index + 1,
        title: item.title,
        src: item.src,
        cover: item.cover,
      }
    })
    musicList.value = list
    currentPlaylistType.value = type
  }
  catch (error) {
    console.error('Failed to fetch music list:', error)
  }
  finally {
    isLoading.value = false
  }
}

// 处理播放列表切换
function handlePlaylistChange(type: PlaylistType) {
  fetchMusicList(type)
}

onMounted(() => {
  fetchMusicList('all')
})
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <van-loading type="spinner" size="24px">
      加载中...
    </van-loading>
  </div>
  <AudioPlaylist
    v-else-if="musicList.length"
    :playlist="musicList"
    :current-playlist-type="currentPlaylistType"
    @playlist-change="handlePlaylistChange"
  />
  <div v-else class="empty-container">
    <van-empty description="暂无音频数据" />
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f9fa;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f9fa;
}
</style>
