<script setup lang="ts">
import type { PlaylistType } from '@/api'
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
  currentPlaylistType?: PlaylistType
}>()

const emit = defineEmits<{
  playlistChange: [type: PlaylistType]
}>()

// 播放列表选项
const playlistOptions = [
  { text: '全部故事', value: 'all' as PlaylistType },
  { text: '本地故事', value: 'local' as PlaylistType },
]

// 当前播放列表类型
const selectedPlaylistType = ref<PlaylistType>(props.currentPlaylistType || 'all')

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

// 单曲循环次数相关
const singleLoopCount = ref(1) // 单曲循环次数，1表示播放一次，0表示无限循环
const currentSingleLoopCount = ref(0) // 当前单曲已循环次数
const showLoopSelector = ref(false) // 是否显示循环次数选择器

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

// 循环状态显示
const loopStatusText = computed(() => {
  if (singleLoopCount.value === 0) {
    return '单曲无限循环'
  }
  if (singleLoopCount.value === 1) {
    return '播放一次'
  }
  return `单曲循环 ${currentSingleLoopCount.value + 1}/${singleLoopCount.value}`
})

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
    currentIndex.value = 0 // 回到第一首
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

// 循环次数选择相关方法
function toggleLoopSelector() {
  showLoopSelector.value = !showLoopSelector.value
}

function setLoopCount(count: number) {
  singleLoopCount.value = count
  currentSingleLoopCount.value = 0 // 重置当前循环次数
  showLoopSelector.value = false
  // 如果设置了循环次数，关闭原来的单曲循环
  if (count > 1 || count === 0) {
    isLoop.value = false
    if (audioRef.value) {
      audioRef.value.loop = false
    }
  }
  showToast(count === 0 ? '设置为无限循环' : `设置循环 ${count} 次`)
}

function resetSingleLoopCount() {
  currentSingleLoopCount.value = 0
}

function initPlay() {
  if (audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.pause()
    audioRef.value.src = selectedPlaylistType.value === 'local'
      ? currentAudio.value.src
      : `https://kuer.77188.com/attachment/${currentAudio.value.src}`
  }
}

function playAudio(index: number) {
  currentIndex.value = index
  duration.value = 0
  currentTime.value = 0
  resetSingleLoopCount() // 重置循环计数
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

  // 如果开启了原生单曲循环，直接返回让audio元素自己循环
  if (isLoop.value) {
    return
  }

  // 检查单曲循环次数
  if (singleLoopCount.value === 0) {
    // 无限循环当前歌曲
    currentSingleLoopCount.value++
    play()
    return
  }
  else if (currentSingleLoopCount.value < singleLoopCount.value - 1) {
    // 还有循环次数，继续播放当前歌曲
    currentSingleLoopCount.value++
    play()
    return
  }

  // 单曲循环完成，播放下一首
  resetSingleLoopCount()
  playNext()
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
  resetSingleLoopCount() // 重置循环计数
  initPlay()
  play()
}

// 播放列表切换
function onPlaylistChange(type: PlaylistType) {
  selectedPlaylistType.value = type
  emit('playlistChange', type)
  // 重置播放状态
  currentIndex.value = 0
  searchKeyword.value = ''
  searchKeywordShow.value = ''
  resetSingleLoopCount()
  pause()
}

// 监听当前音频变化
watch(currentAudio, (newAudio) => {
  if (newAudio && audioRef.value) {
    currentTime.value = 0
    duration.value = 0
  }
}, { immediate: true })

// 监听播放列表类型变化
watch(() => props.currentPlaylistType, (newType) => {
  if (newType && newType !== selectedPlaylistType.value) {
    selectedPlaylistType.value = newType
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

    <!-- 播放列表选择器 -->
    <div class="playlist-selector">
      <van-tabs v-model:active="selectedPlaylistType" @change="onPlaylistChange">
        <van-tab
          v-for="option in playlistOptions"
          :key="option.value"
          :name="option.value"
          :title="option.text"
        />
      </van-tabs>
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

        <!-- 循环次数选择 -->
        <van-button
          icon="orders-o"
          :type="singleLoopCount !== 1 ? 'primary' : 'default'"
          round
          @click="toggleLoopSelector"
        >
          {{ singleLoopCount === 0 ? '∞' : singleLoopCount }}
        </van-button>
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

      <!-- 循环次数选择器 -->
      <van-popup
        v-model:show="showLoopSelector"
        position="bottom"
        :style="{ height: '40%' }"
      >
        <div class="loop-selector">
          <div class="loop-selector-header">
            <h3>选择循环次数</h3>
            <van-button
              type="primary"
              size="small"
              @click="showLoopSelector = false"
            >
              完成
            </van-button>
          </div>
          <div class="loop-options">
            <van-button
              v-for="count in [1, 2, 3, 5, 10, 0]"
              :key="count"
              :type="singleLoopCount === count ? 'primary' : 'default'"
              class="loop-option"
              @click="setLoopCount(count)"
            >
              {{ count === 0 ? '无限循环' : `${count} 次` }}
            </van-button>
          </div>
          <div class="loop-status">
            <p>当前设置: {{ singleLoopCount === 0 ? '无限循环' : `循环 ${singleLoopCount} 次` }}</p>
            <p v-if="singleLoopCount > 0">
              已完成: {{ currentSingleLoopCount + 1 }} / {{ singleLoopCount }}
            </p>
            <p class="current-status">
              状态: {{ loopStatusText }}
            </p>
          </div>
        </div>
      </van-popup>
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

.playlist-selector {
  margin-bottom: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

/* 循环次数选择器样式 */
.loop-selector {
  padding: 20px;
  background: white;
}

.loop-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.loop-selector-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.loop-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.loop-option {
  height: 44px;
  border-radius: 8px;
}

.loop-status {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.loop-status p {
  margin: 8px 0;
}

.current-status {
  font-weight: 600;
  color: #1989fa !important;
}
</style>
