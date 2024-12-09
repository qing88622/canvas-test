<template>
  <Steps :index="3"/>
  <Title title="內科 / 心臟血管科" subTitle="請確認您的掛號內容" />
  <div>
    <div class="schedule-container">
      <table class="schedule-table">
        <thead>
          <tr>
            <th colspan="2" class="header-cell">掛號資訊</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="time-cell">日期</td>
            <td class="schedule-cell">{{ info.registerDate }}</td>
          </tr>
          <tr>
            <td class="time-cell">科別</td>
            <td class="schedule-cell">{{ `${info.subDpt[0]} / ${info.subDpt[1]}` }}</td>
          </tr>
          <tr>
            <td class="time-cell">醫師</td>
            <td class="schedule-cell">{{ info.drName }}</td>
          </tr>
          <tr>
            <td class="time-cell">時段</td>
            <td class="schedule-cell">{{ info.registerTime }}</td>
          </tr>
          <tr>
            <td class="time-cell">序號</td>
            <td class="schedule-cell">{{ info.registerSeat }}
              <span class="note">此號為估算，不代表正式掛號可掛到此處</span>
            </td>
          </tr>
          <tr>
            <td class="time-cell">診療費</td>
            <td class="schedule-cell">$ {{ info.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="form">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :label-position="labelPosition"
        status-icon
        :rules="rules"
        label-width="200"
        require-asterisk-position="right"
      >
        <el-form-item label="身分證字號" prop="personId">
          <el-input
            v-model="ruleForm.personId"
            autocomplete="off"
            placeholder="請輸入身分證號碼"
          />
        </el-form-item>
        <el-form-item label="手機號碼" prop="phone">
          <el-input
            v-model="ruleForm.phone"
            autocomplete="off"
            placeholder="09xxxxxxxx"
          />
        </el-form-item>
        <el-form-item label="驗證碼" prop="num">
          <el-input
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
const info = reactive({
  registerDate: "2024-12-06",
  subDpt: ["內科", "心臟血管科"],
  drName: "劉文正",
  registerTime: "晚診 ( 18:30-21:00 )", //早診 午診 晚診
  registerSeat: 2,
  price: 500,
});

//#region 表單
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  personId: undefined,
  phone: undefined
})

const rules = reactive<FormRules<typeof ruleForm>>({
  personId: [
    { required: true, message: '請輸入資訊', trigger: 'blur' },
    // { min: 8, max: 12, message: '請輸入8~12個英文和數字', trigger: 'blur' },
  ],
  phone: [{ required: true, message: '請輸入資訊', trigger: 'blur' }]
})
//#endregion

//#region 表單提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
        store() 
    } else {
      // ElMessage.warning('請完整填寫表單')
    }
  })}

const store = async () => {}
//#endregion

//#region label-position 的狀態，初始為 'left'
const labelPosition = ref<'left' | 'top'>('left');

// 更新 label-position
const updateLabelPosition = () => {
  labelPosition.value = window.innerWidth <= 768 ? 'top' : 'left';
};

// 組件掛載後，設定初始值並監聽窗口大小變化
onMounted(() => {
  updateLabelPosition();
  window.addEventListener('resize', updateLabelPosition);
});

// 組件卸載時移除監聽
onUnmounted(() => {
  window.removeEventListener('resize', updateLabelPosition);
});
//#endregion
</script>

<style scoped>
/* 手機版樣式 */
@media (max-width: 768px) {
  .mobile-form {
    --el-form-label-position: top;
  }
}

.schedule-container {
  width: 100%;
  overflow-x: auto;
  font-family: Arial, sans-serif;
}

.schedule-table {
  width: 100%;
  min-width: 280px;
  border-collapse: collapse;
  background: white;
  /* table-layout: fixed; */
}

.header-cell {
  background-color: var(--primary);;
  color: white;
  padding: 8px;
  font-size: 1.1em;
  text-align: center;
  border: 1px solid #e5e5e5;
  white-space: nowrap;
}

.time-cell {
  padding: 12px;
  border: 1px solid #e5e5e5;
  background-color: #f8f8f8;
  text-align: left;
  width: 30%;
  max-width: 50px;
}

.schedule-cell {
  padding: 12px;
  border: 1px solid #e5e5e5;
  background-color: #f8f8f8;
  width: 70%;
}

tr:nth-child(even) .schedule-cell,
tr:nth-child(even) .time-cell {
  background-color: #f0f0f0;
}

/* 響應式設計 */
@media screen and (max-width: 768px) {
  .header-cell,
  .time-cell,
  .schedule-cell {
    padding: 8px;
    font-size: 14px;
  }
}

.note {
  background-color: #d96e6e;
  color: azure;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.85em;
  margin-left: 12px;
}

.form {
  margin-top: 40px;
  max-width: 600px;
}
</style>

<route lang="yaml">
meta:
  layout: patient
</route>
