import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname + '/src'),
        },
        extensions: ['.ts', '.vue', '.json'],
    },
    css: {
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer
            ]
        }
    },
    // server: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://127.0.0.1:4523/m1/2763813-0-default',
    //             changeOrigin: true,
    //             rewrite: (path) => path.replace(/^\/api/, '')
    //         },
    //     }
    // }
});
