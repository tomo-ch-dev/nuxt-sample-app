<template>
    <Header />
    <div class="form-box">
        <h2 class="title">パスワード変更</h2>
        <template v-if="exitFlg">
            <form @submit.prevent="changePassword">
                <div class="form-group">
                    <label for="new-password-form">新しいパスワード（8文字以上、半角英数字）</label>
                    <input v-model="newPassword" type="password" class="form-control" id="new-password-form"
                        placeholder="New Password" />
                </div>
                <div class="text-center">
                    <button type="submit" class="btn btn-primary mt-3">パスワードを変更</button>
                </div>
            </form>
        </template>
        <template v-else>
            <div class="content">
                <p>無効なURLです。</p>
                <div class="text-center">
                    <NuxtLink to="/login" class="btn btn-primary mt-3 ">ログインへ</NuxtLink>
                </div>
            </div>
        </template>
    </div>
</template>
  
<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { ResponseObject, ResponseWithEmail } from '~/types';

const route = useRoute();
const router = useRouter();

let email: string = '';
const newPassword: Ref<string> = ref('');
let exitFlg: Ref<boolean> = ref(false);

// アクセスされたURLの:id部分を取得
const token: string = route.params.id as string;
const changePasswordVerify = async (): Promise<void> => {
    const { data: post } = await useFetch('/api/change-password/verify', {
        method: 'POST',
        body: JSON.stringify({
            token: token
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (post.value !== null) {
        const response: ResponseWithEmail = post.value;
        if (response.status) {
            exitFlg.value = true;
            email = response.email;
        } else {
            alert(response.message);
        }
    } else {
        alert('パスワード変更に失敗しました。');
    }
};
changePasswordVerify();

const changePassword = async (): Promise<void> => {
    const { data: post } = await useFetch('/api/change-password/confirm', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: newPassword.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (post.value !== null) {
        const response: ResponseObject = post.value;
        if (response.status) {
            alert('パスワードを変更しました。');
            router.push('/login');
        } else {
            alert(response.message);
        }
    }
};
</script>
  
<style scoped>
.text-center {
    width: 100%;
}
</style>