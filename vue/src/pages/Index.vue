<template>
    <header class="fixed inset-x-0 z-10 bg-gradient-to-b from-black to-black/0 flex justify-between items-center px-8 py-3">

        <router-link to="/" class="btn-hover px-2 py-1 flex items-center space-x-2">
            <VideoCameraIcon class="h-8"></VideoCameraIcon>
            <h1>十七号放映室</h1>
        </router-link>

        <ul class="flex items-center space-x-6">
            <li class="btn-hover">
                <router-link to="/about">关于</router-link>
            </li>
            <li class="btn-hover">
                <a href="https://github.com/MU7L/17cinema">GitHub</a>
            </li>
        </ul>

    </header>

    <router-view></router-view>
</template>

<script setup lang="ts">
import { VideoCameraIcon } from '@heroicons/vue/24/solid';
</script>

<style scoped>
ul>li {
    @apply px-2 py-1
}
</style>
