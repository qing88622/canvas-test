<template>
  <div>
    <canvas ref="canvasRef" id="canvas" width="800" height="600" style="border: 1px solid #ccc;">123</canvas>
    <el-row type="flex" justify="center" style="margin-top: 50px">
      <input id="setColor" v-model="brushColor" @change="selectColor" type="color" style="opacity: 0" />
      <el-button type="primary" @click="openColorSelect">設定畫筆顏色</el-button>
      <el-button :type="paintBrush ? 'primary' : 'default'" @click="openRangeInput">設定畫筆粗細</el-button>
      <el-button type="primary" @click.stop="selectEraser(fabricStatus)">{{ fabricStatus ? '使用畫筆' : '使用橡皮擦' }}</el-button>
      <el-button :type="paintEraser ? 'primary' : 'default'" @click="openBrushNum">設定橡皮擦粗細</el-button>
      <el-button type="primary" @click="undo()">上一步</el-button>
      <el-button type="primary" @click="redo()">下一步</el-button>

      <el-button type="primary" @click="pick()">選取</el-button>
      <!-- 圖片上傳 -->
      <el-upload
      v-model:file-list="fileList"
          class="upload-btn"
          :show-file-list="false"
          accept="image/*"
          :auto-upload="false"
          :on-change="handleImageUpload"
          list-type="picture-card"
        >
          <el-button type="primary">上傳圖片</el-button>
        </el-upload>
       <el-button
          type="success"
          @click="exportImage"
        >
          匯出圖片
        </el-button>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-form>
        <el-form-item v-if="paintBrush" label="設定畫筆粗細">
          <el-slider style="width: 200px" v-model="brushNum" @change="changeBrushNum" />
        </el-form-item>
        <el-form-item v-if="paintEraser" label="設定橡皮擦粗細">
          <el-slider style="width: 200px" v-model="eraser" @change="changeEraserNum" />
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script setup>
// 導入 fabric 第三方庫
import { fabric } from 'fabric-with-erasing';

const fileList = ref([])

const url =ref("")

const handleImageUpload = async(file) => {
  await nextTick()
  // console.log(file)
  // console.log(fileList.value)
  if(!fileList.value.length) return
  url.value=fileList.value[0].url
  drawCanvas();
}

// 建立 canvas 實例
const canvasRef = ref();

// 畫布中預設顯示的圖片路徑
const showImgSrc = 'https://images.ctfassets.net/hrltx12pl8hq/3E5SSUuJCKt1KyebMAdr7f/6b98ce27789b03a6b4a62092ea4566b6/Group_5_B.jpg?fit=fill&w=600&h=400';

// 畫筆顏色
const brushColor = ref('#ff0000');

// 畫筆粗細滑塊顯示/隱藏
const paintBrush = ref(false);

// 畫筆粗細
const brushNum = ref(10);

// 橡皮擦粗細滑塊顯示/隱藏
const paintEraser = ref(false);

// 橡皮擦粗細
const eraser = ref(10);

// 當前狀態為畫筆/橡皮擦
const fabricStatus = ref(false);

// 撤銷的快照陣列，用來記錄歷史
let undoList = [];

// 恢復的快照陣列，用來記錄歷史
let redoList = [];

// 添加新狀態到歷史記錄中
function saveState() {
  undoList.push(JSON.stringify(canvasRef.value.toDatalessJSON()));
}

// 撤銷操作
function undo() {
  if (undoList.length !== 0) {
    const last = undoList.pop();
    redoList.push(last);
    canvasRef.value.loadFromJSON(last, function () {
      canvasRef.value.renderAll();
    });
  }
}

// 恢復操作
function redo() {
  if (redoList.length !== 0) {
    undoList.push(redoList.pop());
    canvasRef.value.loadFromJSON(redoList[redoList.length - 1], function () {
      canvasRef.value.renderAll();
    });
  }
}

// 將圖片繪製到 canvas 中
const drawCanvas = () => {
  const canvas = document.querySelector('#canvas');
  const img = new Image();
  img.src = url.value;
  img.onload = function () {
    canvasRef.value = new fabric.Canvas(canvas, {
      // width: canvas.width,
      // height: canvas.height,
      width: img.width,
      height: img.height,
      selection: false,
      isDrawingMode: true,
      devicePixelRatio: true,
    });

    let imgLayer = new fabric.Image(img, {
      erasable: false,
      selectable: false,
      // left: (canvas.width - img.width) / 2,
      // top: (canvas.height - img.height) / 2,
    });

    canvasRef.value.add(imgLayer);

    canvasRef.value.on('mouse:down', function () {
      saveState();
    });

    canvasRef.value.on('mouse:up', function () {
      saveState();
    });

    // canvasRef.value.on('mouse:wheel', event => {
    //   var delta = event.e.deltaY;
    //   var zoom = canvasRef.value.getZoom();
    //   zoom *= 0.999 ** delta;
    //   if (zoom > 1.5) zoom = 1.5;
    //   if (zoom < 0.5) zoom = 0.5;
    //   canvasRef.value.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
    //   event.e.preventDefault();
    //   event.e.stopPropagation();
    // });
  };
};

// 打開顏色選擇器
const openColorSelect = () => {
  nextTick(() => document.querySelector('#setColor').click());
};

// 修改畫筆顏色
const selectColor = ({ target }) => {
  canvasRef.value.freeDrawingBrush.color = target.value;
};

// 切換橡皮擦/畫筆狀態
const selectEraser = status => {
  if (!status) {
    changeAction('erase');
  } else {
    changeAction('undoErasing');
  }
  fabricStatus.value = !fabricStatus.value;
};

// 打開/關閉畫筆粗細滑塊
const openRangeInput = () => {
  paintBrush.value = !paintBrush.value;
};

// 修改畫筆粗細
const changeBrushNum = () => {
  canvasRef.value.freeDrawingBrush.width = brushNum.value;
  changeAction(fabricStatus.value ? 'erase' : 'undoErasing');
};

// 打開/關閉橡皮擦粗細滑塊
const openBrushNum = () => {
  paintEraser.value = !paintEraser.value;
};

// 修改橡皮擦粗細
const changeEraserNum = () => {
  canvasRef.value.freeDrawingBrush.width = eraser.value;
  changeAction(fabricStatus.value ? 'erase' : 'undoErasing');
};

const pick = () => {
  canvasRef.value.isDrawingMode = false;
};

// 修改畫布行為模式
function changeAction(mode) {
  switch (mode) {
    case 'erase':
      canvasRef.value.freeDrawingBrush = new fabric.EraserBrush(canvasRef.value);
      canvasRef.value.freeDrawingBrush.width = eraser.value;
      break;
    case 'undoErasing':
      canvasRef.value.freeDrawingBrush = new fabric.PencilBrush(canvasRef.value);
      canvasRef.value.freeDrawingBrush.color = brushColor.value;
      canvasRef.value.freeDrawingBrush.width = brushNum.value;
      canvasRef.value.freeDrawingBrush.selectable = false
    default:
      break;
  }
}

 // 匯出圖片
 const exportImage = () => {
    if (!canvasRef.value) return
    
    const dataURL = canvasRef.value.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = dataURL
    link.click()
  }

onMounted(() => {
  // drawCanvas();
});
</script>
