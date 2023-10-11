<template>
    <Header />
    <div class="content">
        <h2 class="mt-5">Enjoy Your NUXT APP!!!</h2>
        <button class="btn btn-danger btn-lg mt-5" @click="logout">ログアウト</button>
    </div>
</template>

<script setup lang="ts">
import { ResponseObject } from '~/types';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async (): Promise<void> => {
    if (!confirm('ログアウトしますか？')) return;
    const { data: post } = await useFetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (post.value !== null) {
        const response: ResponseObject = post.value;
        if (response.status) {
            alert(response.message);
            router.push('/login');
        } else {
            alert(response.message);
        }
    } else {
        alert('ログアウトに失敗しました');
    }
};
</script>