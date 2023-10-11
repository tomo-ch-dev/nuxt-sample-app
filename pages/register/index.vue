<template>
    <Header />
    <div class="form-box">
        <h2 class="title">アカウント登録</h2>
        <form @submit.prevent="register">
            <div class="form-group">
                <label for="email-form">メールアドレス</label>
                <input v-model="email" type="email" class="form-control" id="email-form" placeholder="Email" />
            </div>
            <div class="form-group">
                <label for="password-form">パスワード（8文字以上、半角英数字）</label>
                <input v-model="password" type="password" class="form-control" id="password-form" placeholder="Password" />
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-success mt-3">登録</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { ResponseObject } from '~/types';

const router = useRouter();
const email: Ref<string> = ref('');
const password: Ref<string> = ref('');

const register = async (): Promise<void> => {
    const { data: post } = await useFetch('/api/regist/request', {
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
            useState('emailValue', () => email.value);
            router.push('/register/mail-send');
        } else {
            alert(response.message);
        }
    } else {
        alert('登録に失敗しました。');
    }
}
</script>