<template>
  <div class="bg">
    <div class="container">
      <router-view />
    </div>
  </div>
</template>
<style scoped>
.bg {
  /* 設定背景圖片和顏色疊加 */
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url('../assets/img/bg.png') no-repeat center center;
  background-size: cover;
  /* background-color: rgb(223, 34, 21); */
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    /* background-color: rgb(197, 224, 215); */
}
</style>