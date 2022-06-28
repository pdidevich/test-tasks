<template>
    <div class="error-notice" v-if="show" @click="hideDialog">
        <span>Произошла ошибка, попробуйте повторить позже</span>
    </div>
</template>

<script>
import toggleMixin from '../mixins/toggleMixin';

export default {
    mixins: [toggleMixin],
}
</script>

<style>
.error-notice {
    width: 300px;
    height: 25px;
    border-radius: 9px;
    background-color: rgb(207, 73, 95);
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
    padding: 5px 15px;
    color: white;
    font-size: 12px;
    display: flex;
    align-items: center;
}
</style>
