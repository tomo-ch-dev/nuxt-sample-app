<template>
    <Header />
    <div class="form-box">
        <h2 class="title">パスワード変更</h2>
        <form @submit.prevent="changePasswordRequest">
            <div class="form-group">
                <label for="email-form">メールアドレス</label>
                <input v-model="email" type="email" class="form-control" id="email-form" placeholder="Email" />
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-primary mt-3">パスワード変更を申込</button>
            </div>
        </form>
        <div class="text-center">
            <NuxtLink to="/login" class="btn btn-secondary mt-3">ログイン画面へ戻る</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { ResponseObject } from '~/types';

const router = useRouter();
const email: Ref<string> = ref('');

const changePasswordRequest = async (): Promise<void> => {
    const { data: post } = await useFetch('/api/change-password/request', {
        method: 'POST',
        body: JSON.stringify({
            email: email.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (post.value !== null) {
        const response: ResponseObject = post.value;
        if (response.status) {
            useState('emailValue', () => email.value);
            router.push('/change-password/mail-send');
        } else {
            alert(response.message);
        }
    } else {
        alert('パスワード変更申込に失敗しました。');
    }
};
</script>