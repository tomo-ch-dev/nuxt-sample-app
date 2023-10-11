<template>
    <Header />
    <div class="form-box">
        <h2 class="title">ログイン</h2>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="email-form">メールアドレス</label>
                <input v-model="email" type="email" class="form-control" id="email-form" placeholder="Email" />
            </div>
            <div class="form-group">
                <label for="password-form">パスワード（8文字以上、半角英数字）</label>
                <input v-model="password" type="password" class="form-control" id="password-form" placeholder="Password" />
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-primary mt-3">ログイン</button>
            </div>
        </form>
        <div class="text-center">
            <NuxtLink to="/change-password" class="btn btn-secondary mt-3">パスワードを忘れた場合</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { ResponseObject } from '~/types';

const router = useRouter();
const email: Ref<string> = ref('');
const password: Ref<string> = ref('');

const login = async (): Promise<void> => {
    const { data: post } = await useFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (post.value !== null) {
        const response: ResponseObject = post.value;
        if (response.status) {
            router.push('/home');
        } else {
            alert(response.message);
        }
    } else {
        alert('ログインに失敗しました。');
    }
};
</script>