<template>
  <div class="title">{{ props.title }}</div>
  <p>{{props.subTitle}}</p>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  subTitle: {
    type: String,
    default: "",
  }
});
</script>

<style scoped>
.title {
  font-size: 1.7em;
  font-weight: 600;
  color: var(--tw-gray-600);
  height: auto;
  padding: 15px 0 15px 20px;
  line-height: 1.5;
  position: relative;
}

p {
  padding: 12px 20px;
  margin: 0 0 30px 0;
  color:  var(--tw-gray-500);
}

/* .title {
  height: auto;
  padding-left: 20px;
  font-weight: bold;
  color: #333333;
  line-height: 1.5;
  position: relative;
  padding-top: 15px;
  padding-bottom: 15px;
} */
.title:before,
.h3.clear:after {
  bottom: 0;
  left: 0px;
  width: calc(100% - 60px);
  height: 3px;
  content: "";
  position: absolute;
  background: #56c4cf;
}
.title:after {
  bottom: -11px;
  right: 0px;
  width: 60px;
  height: 29px;
  content: "";
  position: absolute;
  background: url(../../assets/img/line.png);
}
</style>
