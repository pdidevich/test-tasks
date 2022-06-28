<template>
  <div v-if="show" class="dialog" @click="hideDialog">
    <div @click.stop class="dialog__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import toggleMixin from '../mixins/toggleMixin';

export default {
  name: 'my-dialog',
  mixins: [toggleMixin],
  mounted() { },
}
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
}

.dialog__content {
  margin: auto;
  background: white;
  border-radius: 12px;
  min-width: 300px;
  min-height: 100px;
  padding: 20px;
}
</style>
