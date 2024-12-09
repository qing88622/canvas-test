<template>
  <Steps :index="1"/>
  <Title title="預約掛號" subTitle="請選擇就診科別" />
  <div class="custom-style">
    <el-segmented v-model="current" :options="dptList" size="large" />
  </div>
  <div class="subdpt-wrap">
    <el-row :gutter="16">
      <template v-for="item in subDptList" :key="item.id">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <el-button
            size="large"
            style="
              width: 100%;
              font-size: 1.1em;
              margin: 8px 0;
              white-space: normal;
            "
            @click="goToPage"
            plain
          >
            {{ item.label }}
          </el-button>
        </el-col>
      </template>
    </el-row>
    <!-- <el-space wrap>
      <div v-for="item in subDptList" :key="item.id">
        <el-button size="large" style="width:300px;font-size: 1.1em;"> {{ item.label }} </el-button>
      </div>
    </el-space> -->
  </div>
</template>
<script setup lang="ts">
// import { fetchDepartments } from "@/mockApi";
// const yy = await fetchDepartments();
// console.log(yy)

const api = [
  {
    id: 0,
    label: "內科",
    subDpt: [
      { id: 0, label: "胸腔內科" },
      { id: 1, label: "心臟血管科" },
      { id: 2, label: "腎臟科" },
      { id: 3, label: "新陳代謝科" },
      { id: 4, label: "肝膽腸胃科" },
      { id: 5, label: "家醫科" },
      { id: 6, label: "神經內科" },
      { id: 7, label: "糖尿病內科" },
    ],
  },
  {
    id: 1,
    label: "外科",
    subDpt: [
      { id: 0, label: "一般外科" },
      { id: 1, label: "心臟外科" },
      { id: 2, label: "神經外科" },
      { id: 3, label: "整形外科" },
      { id: 4, label: "骨科" },
      { id: 5, label: "泌尿外科" },
      { id: 6, label: "胸腔外科" },
      { id: 7, label: "肝膽外科" },
      { id: 8, label: "大腸直腸外科" },
      { id: 9, label: "肛門外科" },
      { id: 10, label: "脊椎外科" },
      { id: 11, label: "血管外科" },
      { id: 12, label: "小兒外科" },
      { id: 13, label: "顏面外科" },
      { id: 14, label: "整形美容外科" },
      { id: 15, label: "人工關節外科" },
    ],
  },
  {
    id: 2,
    label: "婦產小兒",
    subDpt: [
      { id: 0, label: "婦科" },
      { id: 1, label: "兒童保健暨疫苗接種" },
      { id: 2, label: "青少年門診(精準氣喘過敏風濕及腎臟)" },
    ],
  },
  {
    id: 3,
    label: "急診科",
    subDpt: [
      { id: 0, label: "成人急診" },
      { id: 1, label: "小兒急診" },
    ],
  },
  {
    id: 4,
    label: "中醫科",
    subDpt: [
      { id: 0, label: "針灸科" },
      { id: 1, label: "內科" },
      { id: 2, label: "婦科" },
    ],
  },
  {
    id: 5,
    label: "獨立部科",
    subDpt: [
      { id: 0, label: "放射科" },
      { id: 1, label: "麻醉科" },
      { id: 2, label: "病理科" },
      { id: 3, label: "社區心理健康社區心理健康諮詢門診" },
    ],
  },
];

interface ISubDpt {
  id: number;
  label: string;
}

interface IDpt {
  id: number;
  label: string;
  subDpt: ISubDpt[];
}

interface IDptConvert {
  value: number;
  label: string;
  subDpt: ISubDpt[];
}

function convertValueToId(data: IDpt[]): IDptConvert[] {
  return data.map(({ id, label, subDpt }) => ({
    value: id,
    label,
    subDpt: subDpt?.map(({ id, label }) => ({ id, label })),
  }));
}

const dptList = reactive(convertValueToId(api));

const current = ref(2);

const subDptList = computed(() => {
  const dptCurrent = dptList.find((item) => item.value === current.value);
  if (dptCurrent) {
    return dptCurrent.subDpt;
  } else {
    return [];
  }
});

const router = useRouter()

const goToPage = () => {
  router.push('/doctor');
};
</script>

<style>
.custom-style .el-segmented {
  --el-border-radius-base: 36px;
  --el-segmented-padding: 3px;
}
.custom-style .el-segmented__item {
  padding: 0 20px;
}

.custom-style {
  margin-bottom: 20px;
}

.subdpt-wrap {
  background-color: #ebf4f781;
  padding: 12px 20px;
  border-radius: 0.5em;
}

.custom-style .el-segmented__item {
  position: relative;
}

.custom-style .el-segmented__item.is-selected::after {
  content: "";
  position: absolute;
  bottom: -9px; /* 根據需要調整箭頭位置 */
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--primary); /* 或選中項目的顏色 */
}
</style>

<route lang="yaml">
meta:
  layout: patient
</route>
