<template>
  <Steps :index="2" />
  <Title title="內科 / 心臟血管科" subTitle="請選擇看診醫生" />
  <div class="custom-style">
    <el-segmented v-model="current" :options="dptList" size="large" />
  </div>
  <div class="subdpt-wrap">
    <!--  -->
    <div class="schedule-container">
      <table class="schedule-table">
        <thead>
          <tr>
            <th class="header-cell time-header">時段 / 日期</th>
            <th
              v-for="(date, index) in weekDates"
              :key="index"
              class="header-cell"
            >
              {{ getWeekdayChinese(date.getDay()) }}<br />
              {{ formatDate(date) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(slot, index) in timeSlots" :key="index">
            <td class="time-cell">
              {{ slot.label }}<br />
              <span class="time-span">{{ slot.time }}</span>
            </td>
            <td
              v-for="(item, colIndex) in slot.days"
              :key="colIndex"
              class="schedule-cell"
            >
              <div
                v-for="(day, cIndex) in item"
                :key="cIndex"
                style="
                  margin: 8px;
                  padding: 8px;
                  background-color: var(--primary-light-3);
                "
              >
                <p>{{ day.doctor }}</p>
                <button v-if="day.status === 1" @click="goToPage">
                  {{ status[day.status] }}
                </button>
                <p v-else style="color: #ef4444; font-size: 0.8em">
                  {{ status[day.status] }}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--  -->
  </div>
</template>
<script setup lang="ts">
const router = useRouter();

const goToPage = () => {
  router.push("/confirm");
};

const dptList = reactive([
  {
    value: 0,
    label: "本周",
  },
  {
    value: 1,
    label: "下一周",
  },
]);

const current = ref(0);

interface TimeSlot {
  label: string;
  time: string;
}

// const timeSlots: TimeSlot[] = [
//   { label: "上午診", time: "08:30-12:00" },
//   { label: "下午診", time: "14:30-17:00" },
//   { label: "晩診", time: "18:30-21:00" },
//   { label: "夜診", time: "23:00-06:00" },
// ];

const status = {
  0: "休診",
  1: "線上掛號",
  2: "超過開放時間",
  3: "請現場掛號",
  4: "名額已滿",
};

const timeSlots: TimeSlot[] = [
  {
    label: "上午診",
    time: "08:30-12:00",
    days: [
      [
        {
          doctor: "劉文正",
          status: 0,
        },
        {
          doctor: "王大明",
          status: 1,
        },
        {
          doctor: "王二明",
          status: 2,
        },
        {
          doctor: "文正劉",
          status: 3,
        },
      ],
      [
        {
          doctor: "劉文正",
          status: 0,
        },
        {
          doctor: "王大明",
          status: 1,
        },
      ],
      [
        {
          doctor: "劉文正",
          status: 0,
        },
        {
          doctor: "王大明",
          status: 1,
        },
        {
          doctor: "王二明",
          status: 2,
        },
      ],
      [],
      [],
      [],
      [
        {
          doctor: "王二明",
          status: 2,
        },
        {
          doctor: "文正劉",
          status: 3,
        },
      ],
    ],
  },
  {
    label: "下午診",
    time: "14:30-17:00",
    days: [
      [],
      [
        {
          doctor: "王二明",
          status: 2,
        },
        {
          doctor: "文正劉",
          status: 3,
        },
      ],
      [],
      [],
      [],
      [],
      [],
    ],
  },
  { label: "晩診", time: "18:30-21:00", days: [[], [], [], [], [], [], []] },
  { label: "夜診", time: "23:00-06:00", days: [[], [], [], [], [], [], []] },
];

const getWeekDates = (): Date[] => {
  const today = new Date();
  today.getDate();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekdayChinese = (index: number): string => {
  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  return weekdays[index];
};

const weekDates = getWeekDates();
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

/*  */
.schedule-container {
  width: 100%;
  overflow-x: auto;
  font-family: Arial, sans-serif;
}

.schedule-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  background: white;
}

.header-cell {
  background-color: #5fbdbd;
  color: white;
  padding: 12px;
  text-align: center;
  border: 1px solid #e5e5e5;
  font-weight: normal;
  white-space: nowrap;
}

.time-header {
  min-width: 120px;
}

.time-cell {
  padding: 12px;
  border: 1px solid #e5e5e5;
  background-color: #f8f8f8;
  text-align: left;
}

.time-span {
  color: #4a90e2;
  font-size: 0.9em;
}

.schedule-cell {
  border: 1px solid #e5e5e5;
  background-color: #f8f8f8;
  min-width: 100px;
}

tr:nth-child(even) .schedule-cell,
tr:nth-child(even) .time-cell {
  background-color: #f0f0f0;
}

/* 響應式設計 */
@media screen and (max-width: 768px) {
  .schedule-table {
    min-width: 600px;
  }

  .header-cell,
  .time-cell,
  .schedule-cell {
    padding: 8px;
  }
}
</style>

<route lang="yaml">
meta:
  layout: patient
</route>
