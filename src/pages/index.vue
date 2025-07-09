<script setup lang="ts" generic="T extends any, O extends any">
import { getMusicList } from '@/api'
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

async function fetchMusicList() {
  try {
    const res = await getMusicList()
    const list = res.data.map((item: AudioItem, index: number) => {
      return {
        sort: index + 1,
        title: item.title,
        src: item.src,
        cover: item.cover,
      }
    })
    musicList.value = list
  }
  catch (error) {
    console.error('Failed to fetch user list:', error)
  }
}

onMounted(() => {
  fetchMusicList()
})
</script>

<template>
  <AudioPlaylist v-if="musicList.length" :playlist="musicList" />
</template>
