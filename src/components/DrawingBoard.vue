<template>
  <div class="image-editor">
    canvas--{{ canvas }}
    <br />
    canvasContainer--{{ canvasContainer }}
    <br />
    fabricCanvas--{{ fabricCanvas }}
    <br />
    isDrawing--{{ isDrawing }}
    <br />
    <div class="tools mb-4 flex items-center gap-2">
        <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :limit="2"
            :on-exceed="handleExceed"
            :auto-upload="false"
        >
            <template #trigger>
            <el-button type="primary">select file</el-button>
            </template>
            <el-button class="ml-3" type="success" @click="toCanvas">
            upload to server
            </el-button>
            <template #tip>
            <div class="el-upload__tip text-red">
                limit 1 file, new file will cover the old file
            </div>
            </template>
        </el-upload>

      <!-- <el-upload
          class="upload-btn"
          :show-file-list="false"
          accept="image/*"
          :before-upload="handleUpload"
        >
          <el-button type="primary">上傳圖片</el-button>
        </el-upload> -->

      <el-button
        :class="{ 'is-active': currentMode === 'draw' }"
        @click="setMode('draw')"
      >
        畫筆
      </el-button>

      <el-button
        :class="{ 'is-active': currentMode === 'rect' }"
        @click="setMode('rect')"
      >
        矩形
      </el-button>

      <el-color-picker v-model="currentColor" @change="updateBrushColor" />

      <el-button type="success" @click="exportImage"> 匯出圖片 </el-button>
    </div>

    <div class="canvas-container" ref="canvasContainer">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
//   import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Canvas, Rect, PencilBrush, Image as FabricImage } from "fabric";
import { ElMessage } from "element-plus";;


//#region
const canvas = ref(null);
const canvasContainer = ref(null);
const fabricCanvas = ref(null);
const currentColor = ref("#000000");
const currentMode = ref("draw");
const isDrawing = ref(false);
let startPoint = null;
let currentObject = null;

// 初始化畫布
const initializeCanvas = () => {
  if (!canvas.value || !canvasContainer.value) return;

  const container = canvasContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // 設置畫布大小
  fabricCanvas.value = new Canvas(canvas.value, {
    width,
    height,
    isDrawingMode: true,
    backgroundColor: "#ffffff",
  });

  // 初始化畫筆
  const pencilBrush = new PencilBrush(fabricCanvas.value);
  pencilBrush.color = currentColor.value;
  pencilBrush.width = 2;
  fabricCanvas.value.freeDrawingBrush = pencilBrush;

  // 添加事件監聽
  fabricCanvas.value.on("mouse:down", handleMouseDown);
  fabricCanvas.value.on("mouse:move", handleMouseMove);
  fabricCanvas.value.on("mouse:up", handleMouseUp);
};

// 處理圖片上傳
const handleUpload = (file) => {
  if (!file) return false;

  const reader = new FileReader();
  reader.onload = (e) => {
    const imgURL = e.target.result;
    FabricImage.fromURL(imgURL, (img) => {
      // 清除現有內容
      fabricCanvas.value.clear();

      // 調整圖片大小以適應畫布
      const canvasWidth = fabricCanvas.value.width;
      const canvasHeight = fabricCanvas.value.height;
      const scale = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      );

      img.scale(scale);

      // 置中圖片
      img.center();

      // 設置為背景
      fabricCanvas.value.setBackgroundImage(
        img,
        fabricCanvas.value.renderAll.bind(fabricCanvas.value)
      );

      ElMessage.success("圖片上傳成功");
    });
  };
  reader.readAsDataURL(file);
  return false; // 阻止 el-upload 默認上傳行為
};

// 更新畫筆顏色
const updateBrushColor = (color) => {
  if (fabricCanvas.value && fabricCanvas.value.freeDrawingBrush) {
    fabricCanvas.value.freeDrawingBrush.color = color;
  }
};

// 設置繪圖模式
const setMode = (mode) => {
  currentMode.value = mode;
  if (fabricCanvas.value) {
    fabricCanvas.value.isDrawingMode = mode === "draw";
  }
};

// 矩形繪製相關函數
const handleMouseDown = (e) => {
  if (currentMode.value !== "rect") return;

  isDrawing.value = true;
  const pointer = fabricCanvas.value.getPointer(e);
  startPoint = pointer;

  const rect = new Rect({
    left: pointer.x,
    top: pointer.y,
    width: 0,
    height: 0,
    fill: "transparent",
    stroke: currentColor.value,
    strokeWidth: 2,
  });

  fabricCanvas.value.add(rect);
  currentObject = rect;
};

const handleMouseMove = (e) => {
  if (!isDrawing.value || currentMode.value !== "rect") return;

  const pointer = fabricCanvas.value.getPointer(e);

  if (startPoint.x > pointer.x) {
    currentObject.set({ left: pointer.x });
  }
  if (startPoint.y > pointer.y) {
    currentObject.set({ top: pointer.y });
  }

  currentObject.set({
    width: Math.abs(startPoint.x - pointer.x),
    height: Math.abs(startPoint.y - pointer.y),
  });

  fabricCanvas.value.renderAll();
};

const handleMouseUp = () => {
  isDrawing.value = false;
  currentObject = null;
};

// 匯出圖片
const exportImage = () => {
  if (fabricCanvas.value) {
    const dataURL = fabricCanvas.value.toDataURL({
      format: "png",
      quality: 1,
    });
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = dataURL;
    link.click();
  }
};

// 生命週期鉤子
onMounted(async () => {
  await nextTick();
  initializeCanvas();
});

onUnmounted(() => {
  if (fabricCanvas.value) {
    fabricCanvas.value.dispose();
  }
});
//#endregion

import { genFileId } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadInstance,  UploadRawFile } from "element-plus";

const fileList = ref<UploadUserFile[]>([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
//   upload.value!.clearFiles()
//   const file = files[0] as UploadRawFile
//   file.uid = genFileId()
//   upload.value!.handleStart(file)
}

const toCanvas = () => {
    console.log(fileList.value)
}
</script>

<style scoped>
.image-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.canvas-container {
  flex: 1;
  min-height: 600px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.tools {
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.is-active {
  background-color: #409eff;
  color: white;
}
</style>
