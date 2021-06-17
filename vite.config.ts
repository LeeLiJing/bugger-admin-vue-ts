import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { svgBuilder } from './src/core/hook/svg';

const resolveDir = (dir: string): string => resolve(__dirname, '.', dir);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ vue(), vueJsx(), svgBuilder('./src/assets/icons/') ],
    resolve: {
        alias: [
            { find: '@', replacement: resolveDir('src') },
            { find: '#', replacement: resolveDir('src/core/') }
        ]
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import \'./src/assets/css/common.scss\';'
            }
        }
    },
    server: {
        port: 9000,
        hmr: {
            overlay: true
        },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:7001',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        sourcemap: false,
        polyfillDynamicImport: false
    },
    optimizeDeps: {
        exclude: [ 'vue-demi' ]
    },
    logLevel: 'info'
});
