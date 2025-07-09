<script setup lang="ts">
import { showToast } from 'vant'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface AudioItem {
  sort: number
  title: string
  src: string
  cover?: string
}

const props = defineProps<{
  playlist: AudioItem[]
}>()

// 响应式数据
const searchKeywordShow = ref('')
const searchKeyword = ref('')
const currentIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isLoop = ref(false)
const volume = ref(100)
const isLoading = ref(false)
const audioRef = ref<HTMLAudioElement>()

// 计算属性
const filteredPlaylist = computed(() => {
  if (!searchKeyword.value.trim()) {
    return props.playlist
  }
  const keyword = searchKeyword.value.toLowerCase()
  return props.playlist.filter(item =>
    item.title.toLowerCase().includes(keyword) || item.sort === Number(keyword),
  )
})

const currentAudio = computed(() => {
  return filteredPlaylist.value[currentIndex.value] || null
})

const progress = ref(0)

function formatTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 音频控制方法
async function play() {
  if (!audioRef.value || !currentAudio.value)
    return

  try {
    isLoading.value = true
    await audioRef.value.play()
    isPlaying.value = true
  }
  catch (error) {
    console.error('播放失败:', error)
    showToast('播放失败')
  }
  finally {
    isLoading.value = false
  }
}

function pause() {
  if (!audioRef.value)
    return
  audioRef.value.pause()
  isPlaying.value = false
}

function togglePlay() {
  if (isPlaying.value) {
    pause()
  }
  else {
    play()
  }
}

function playNext() {
  if (currentIndex.value < filteredPlaylist.value.length - 1) {
    currentIndex.value++
  }
  else {
    currentIndex.value = 0 // 循环播放
  }
  initPlay()
  play()
}

function playPrevious() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
  else {
    currentIndex.value = filteredPlaylist.value.length - 1 // 循环播放
  }
  initPlay()
  play()
}

function setLoop() {
  isLoop.value = !isLoop.value
  if (audioRef.value) {
    audioRef.value.loop = isLoop.value
  }
}

function initPlay() {
  if (audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.pause()
    audioRef.value.src = `https://kuer.77188.com/attachment/${currentAudio.value.src}`
  }
}

function playAudio(index: number) {
  currentIndex.value = index
  duration.value = 0
  currentTime.value = 0
  initPlay()
  play()
}

function seek(count: number) {
  if (!audioRef.value)
    return
  const seekTime = (count / 100) * duration.value
  audioRef.value.currentTime = seekTime
  // play()
}

function changeVolume(count: number) {
  if (!audioRef.value)
    return
  audioRef.value.volume = count / 100
}

// 音频事件处理
function onLoadedMetadata() {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

function onTimeUpdate() {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
    progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  }
}

function onEnded() {
  isPlaying.value = false
  if (isLoop.value)
    return
  // 自动播放下一首
  playNext()
  // 延迟一点时间再播放，确保音频已切换
  setTimeout(() => {
    play()
  }, 100)
}

function onError() {
  isLoading.value = false
  isPlaying.value = false
  showToast('音频加载失败')
}

function onCanPlay() {
  isLoading.value = false
}

function onSearch() {
  currentIndex.value = 0
  searchKeyword.value = searchKeywordShow.value
  initPlay()
  play()
}

// 监听当前音频变化
watch(currentAudio, (newAudio) => {
  if (newAudio && audioRef.value) {
    currentTime.value = 0
    duration.value = 0
  }
}, { immediate: true })

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
    initPlay()
  }
})

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<template>
  <div class="audio-playlist">
    <!-- 搜索框 -->
    <div class="search-section">
      <van-search
        v-model="searchKeywordShow"
        placeholder="搜索故事名或序号"
        @search="onSearch"
      />
    </div>

    <!-- 当前播放信息 -->
    <div v-if="currentAudio" class="current-player">
      <div class="player-info">
        <div class="cover">
          <img
            v-if="currentAudio.cover"
            :src="currentAudio.cover"
            :alt="currentAudio.title"
          >
          <div v-else class="default-cover">
            <van-icon name="music-o" size="40" />
          </div>
        </div>
        <div class="info">
          <div class="title">
            {{ currentAudio.title }}
          </div>
          <div class="artist">
            第{{ currentAudio.sort }}页
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <van-slider
          v-model="progress"
          class="progress-slider"
          @change="seek"
        />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <van-button
          icon="arrow-left"
          round
          @click="playPrevious"
        />
        <van-button
          :icon="isLoading ? 'loading' : (isPlaying ? 'pause' : 'play')"
          round
          type="primary"
          :loading="isLoading"
          @click="togglePlay"
        />
        <van-button
          icon="arrow"
          round
          @click="playNext"
        />
        <!-- 单曲循环 -->
        <van-button
          icon="replay"
          :type="isLoop ? 'primary' : 'default'"
          round
          @click="setLoop"
        />
      </div>

      <!-- 音量控制 -->
      <div class="volume-section">
        <van-icon size="0.4rem" name="volume-o" />
        <van-slider
          v-model="volume"
          class="volume-slider"
          @change="changeVolume"
        />
      </div>
    </div>

    <!-- 播放列表 -->
    <div class="playlist-section">
      <div class="playlist-header">
        <h3>播放列表 ({{ filteredPlaylist.length }})</h3>
      </div>

      <van-list class="playlist">
        <van-cell
          v-for="(item, index) in filteredPlaylist"
          :key="index"
          :class="{ active: item.sort === currentAudio.sort }"
          clickable
          @click="playAudio(index)"
        >
          <template #title>
            <div class="song-info">
              <div class="song-title">
                {{ item.title }} <span class="song-artist">（第{{ item.sort }}页）</span>
                <van-icon
                  v-if="item.sort === currentAudio.sort && isPlaying"
                  name="volume"
                  color="#1989fa"
                />
              </div>
            </div>
          </template>
          <template #right-icon>
            <div class="flex items-center">
              <van-icon v-if="item.sort === currentAudio.sort && isPlaying" color="#1989fa" size="0.35rem" name="pause-circle-o" />
              <van-icon v-else size="0.35rem" name="play-circle-o" />
            </div>
          </template>
        </van-cell>
      </van-list>
    </div>

    <!-- 隐藏的音频元素 -->
    <audio
      ref="audioRef"
      preload="metadata"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @error="onError"
      @canplay="onCanPlay"
    />
  </div>
</template>

<style scoped>
.audio-playlist {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f8f9fa;
  height: 100vh;
}

.search-section {
  margin-bottom: 16px;
}

.current-player {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.player-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 12px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-cover {
  color: #999;
}

.info {
  flex: 1;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.artist {
  font-size: 14px;
  color: #666;
}

.progress-section {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.time {
  font-size: 12px;
  color: #666;
  min-width: 40px;
}

.progress-slider {
  flex: 1;
  margin: 0 12px;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-slider {
  flex: 1;
}

.playlist-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.playlist-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.playlist-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.playlist {
  flex: 1;
  overflow-y: auto;
}

.playlist .van-cell.active {
  background: #f0f8ff;
}

.song-info {
  display: flex;
  flex-direction: column;
}

.song-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.song-artist {
  font-size: 14px;
  color: #666;
}
</style>
