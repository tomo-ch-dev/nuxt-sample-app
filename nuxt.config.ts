// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';
import "reflect-metadata";
import dotenv from 'dotenv';

const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envPath });

export default defineNuxtConfig({
    css: [
        'bootstrap/dist/css/bootstrap.min.css',
        'assets/css/global.css',
        '@fortawesome/fontawesome-svg-core/styles.css',
    ],
    plugins: [
        { src: '~/plugins/bootstrap.ts', mode: 'client' }
    ],
    ssr: true,
    nitro: {
        storage: {
            'redis': {
                driver: 'redis',
                /* redis コネクタオプション */
                port: 6379, // Redis ポート
                host: "127.0.0.1", // Redis ホスト
                username: "", // Redis のバージョンが 6 以上の時必要
                password: "",
                db: 0, // デフォルト 0
                tls: {} // tls/ssl
            }
        }
    },
});