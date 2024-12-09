<template>
  <div class="step-container">
    <template  v-for="(item, index) in showList" :key="item.id">
      <BaseButton :text="item.text" :isCurrent="index ===showList.length-1" @click="goToPage(item.id)" />
      <ArrowIcon v-if="index !==showList.length-1"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

const router = useRouter();

// 根據按鈕 id 來導航到不同頁面
const goToPage = (id: number) => {

  // 找到對應的路徑並導航
  const route = list.find(item => item.id === id);
  if (route) {
    router.push(route.path);
  }
};

const props = defineProps({
  index: {
    type: Number,
    default: 1,
  }
});

const showList = computed(()=>{
  const target = []
  for(let i=0;i<list.length;i++){
    target.push(list[i])
    if(list[i].id===props.index) break
  }
  return target
})

const list =[
  {
    id:0,
    text: "預約掛號",
    path: '/subdpt'
  },
  {
    id:1,
    text: "選擇科別",
    path: '/subdpt'
  },
  {
    id:2,
    text: "選擇醫生",
    path: '/doctor'
  },
  {
    id:3,
    text: "確認掛號內容",
    path: '/confirm'
  },
  {
    id:4,
    text: "掛號結果",
    path: '/result'
  },
]
</script>

<style scoped>
.step-container {
  display: flex;
  align-items: center;
  padding: 20px 0;
}
</style>
