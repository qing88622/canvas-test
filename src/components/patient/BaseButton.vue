<template>
  <el-button
    :type="props.isCurrent ? 'primary' : ''"
    :disabled="disabled"
    size="large"
    round
    style="font-size: 1.1em"
  >
    {{ props.text }}
  </el-button>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// 計算按鈕的類別
// const buttonClasses = computed(() => {
//   return {
//     'btn': true,
//     'current': props.isCurrent && !props.disabled, // 當前按鈕樣式
//     'disabled': props.disabled, // 禁用按鈕樣式
//   };
// });
</script>

<style scoped>
/* .btn a.active {
    background: #56c4cf;
    color: #fff;
} */
/* .btn{
    background: #56c4cf;
    color: #fff;
    padding: 8px 16px;
    border-radius: 2em;
    border: none;
    margin: 8px;
    letter-spacing: 0.1em;
    font-size: 1.1em;
    font-weight: 300;
} */

.btn {
  padding: 8px 16px;
  font-size: 1.1em;
  /* font-weight: 300; */
  border-radius: 2em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

/* 當前按鈕 (isCurrent 為 true) */
.btn.current {
  background-color: var(--primary);
  color: white;
}

.btn.current:hover {
  background-color: var(--primary-dark);
}

.btn.current:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5); /* 藍色聚焦 */
}

/* 禁用按鈕 (disabled 為 true) */
.btn.disabled {
  background-color: #d1d5db; /* 灰色背景 */
  color: #fff;
  cursor: not-allowed;
}
</style>
