<template>
    <Header />
    <div class="form-box">
        <h2 class="title">アカウント登録</h2>
        <div class="content">
            <div v-if="exitFlg">
                <p>認証し、本登録が完了しました。</p>
                <p>ログインできます。</p>
                <div class="text-center">
                    <NuxtLink to="/login" class="btn btn-primary mt-3">ログインへ進む</NuxtLink>
                </div>
            </div>
            <div v-else>
                <p>無効なURLです。</p>
                <div class="text-center">
                    <NuxtLink to="/register" class="btn btn-success mt-3">アカウント登録へ</NuxtLink>
                    <NuxtLink to="/login" class="btn btn-primary mt-3">ログインへ</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ResponseObject } from '~/types';

const route = useRoute();

// アクセスされたURLの:id部分を取得
const token: string = route.params.id as string;
let exitFlg: Ref<boolean> = ref(false);

const registConfirm = async (): Promise<void> => {
    const { data: post } = await useFetch('/api/regist/confirm', {
        method: 'POST',
        body: JSON.stringify({
            token: token
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (post.value !== null) {
        const response: ResponseObject = post.value;
        if (response.status) {
            exitFlg.value = true;
        } else {
            alert(response.message);
        }
    } else {
        alert('本登録に失敗しました。');
    }
};
registConfirm();
</script>

<style scoped>
.content {
    padding: 0 10%;
}
</style>