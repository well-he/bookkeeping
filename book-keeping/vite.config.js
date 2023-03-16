import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
    base: './',
    server: {
        base: './',
    },
    plugins: [
        vue(),
        Components({
            resolvers: [VantResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src/'),
        },
    },
});
