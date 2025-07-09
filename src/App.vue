<script setup lang="ts">
import { themeVars } from '@/plugins/vant-theme'
</script>

<template>
  <VanConfigProvider :theme-vars="themeVars">
    <RouterView />
  </VanConfigProvider>
</template>
