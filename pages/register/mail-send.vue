<template>
    <Header />
    <div class="form-box">
        <h2 class="title">アカウント登録</h2>
        <div class="content">
            <div v-if="email">
                <a class="email">{{ email }}</a> へ登録確認メールを送信しました。
                メールを確認して、本登録を完了してください。
            </div>
            <div v-else>
                ページを閉じてください。
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const email: Ref<string> = useState('emailValue');
</script>

<style scoped>
.email {
    color: #007bff;
    text-decoration: underline;
}

.content {
    padding: 0 10%;
}
</style>