<template>
  <div>
    <canvas
      ref="canvasRef"
      id="canvas"
      width="800"
      height="600"
      style="border: 1px solid #ccc"
      >123</canvas
    >
    <el-row type="flex" justify="center" style="margin-top: 8px">
      <!-- 圖片上傳 -->
      <el-upload
        v-model:file-list="fileList"
        class="upload-btn"
        :show-file-list="false"
        accept="image/*"
        :auto-upload="false"
        :on-change="handleImageUpload"
        list-type="picture"
      >
        <el-button type="success" plain>上傳圖片</el-button>
      </el-upload>
      <!-- 匯出圖片 -->
      <el-button type="success" @click="exportImage" style="margin-left: 24px"
        >匯出圖片</el-button
      >
    </el-row>

    <el-row type="flex" justify="center" style="margin-top: 30px">
      <input
        id="setColor"
        v-model="brushColor"
        @change="selectColor"
        type="color"
        style="opacity: 0"
      />
      <el-button @click="openColorSelect">顏色</el-button>
      <!-- <el-button :type="paintBrush ? 'primary' : 'default'" @click="openRangeInput">設定畫筆粗細</el-button> -->

      <el-button
        :type="toolType === 'brush' ? 'primary' : ''"
        @click.stop="setTool('brush')"
        >畫筆</el-button
      >
      <el-button
        :type="toolType === 'eraser' ? 'primary' : ''"
        @click.stop="setTool('eraser')"
        >橡皮擦</el-button
      >

      <!-- <el-button :type="paintEraser ? 'primary' : 'default'" @click="openBrushNum">設定橡皮擦粗細</el-button> -->

      <el-button
        :type="isRectMode ? 'primary' : 'default'"
        @click="setTool('rect')"
        >矩形</el-button
      >
      <el-button
        :type="toolType === 'pick' ? 'primary' : ''"
        @click="setTool('pick')"
        >選取</el-button
      >
      <!-- 上一步 -->
      <el-button @click="undo()">
        <svg
          style="width: 16px"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </el-button>
      <!-- 下一步 -->
      <el-button @click="redo()">
        <svg
          style="width: 16px"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
          />
        </svg>
      </el-button>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-form>
        <el-form-item v-if="!isEraserSlider" label="畫筆粗細">
          <el-slider
            style="width: 200px"
            v-model="brushNum"
            @change="changeBrushNum"
          />
        </el-form-item>
        <el-form-item v-else label="橡皮擦粗細">
          <el-slider
            style="width: 200px"
            v-model="eraserNum"
            @change="changeEraserNum"
          />
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script setup>
// 導入 fabric 第三方庫
import { fabric } from "fabric-with-erasing";

const fileList = ref([]);

const url = ref("");

const handleImageUpload = async (file) => {
  await nextTick();
  // console.log(file)
  // console.log(fileList.value)
  if (!fileList.value.length) return;
  url.value = fileList.value[0].url;
  drawCanvas();
};

// 建立 canvas 實例
const canvasRef = ref();

// 畫布中預設顯示的圖片路徑
const showImgSrc =
  "https://images.ctfassets.net/hrltx12pl8hq/3E5SSUuJCKt1KyebMAdr7f/6b98ce27789b03a6b4a62092ea4566b6/Group_5_B.jpg?fit=fill&w=600&h=400";

// 畫筆顏色
const brushColor = ref("#ff0000");

// 畫筆粗細滑塊顯示/隱藏
// const paintBrush = ref(true);

// 畫筆粗細
const brushNum = ref(10);

// 橡皮擦粗細滑塊顯示/隱藏
// const paintEraser = ref(false);

// 橡皮擦粗細
const eraserNum = ref(10);

// 控制粗細為 畫筆false/橡皮擦true
const isEraserSlider = ref(false);

// 撤銷的快照陣列，用來記錄歷史
let undoList = [];

// 恢復的快照陣列，用來記錄歷史
let redoList = [];

//#region 矩形
const isRectMode = ref(false);
const isDrawing = ref(false);
const tempRect = ref(null);

// Rectangle drawing mode toggle
// const toggleRectMode = () => {
//   isRectMode.value = !isRectMode.value;
//   if (isRectMode.value) {
//     canvasRef.value.isDrawingMode = false;
//     setupRectangleDrawing();
//   } else {
//     canvasRef.value.isDrawingMode = true;
//     removeRectangleDrawing();
//   }
// };

watch(
  () => isRectMode.value,
  (newVal) => {
    console.log(newVal);
    if (newVal) {
      canvasRef.value.isDrawingMode = false;
      // canvasRef.value.freeDrawingBrush.selectable = false
      setupRectangleDrawing();
    } else {
      if (toolType.value === "brush" || toolType.value === "eraser") {
        canvasRef.value.isDrawingMode = true;
      }
      removeRectangleDrawing();
    }
  }
);

// Set up rectangle drawing event listeners
const setupRectangleDrawing = () => {
  if (!canvasRef.value) return;

  canvasRef.value.on("mouse:down", handleMouseDown);
  canvasRef.value.on("mouse:move", handleMouseMove);
  canvasRef.value.on("mouse:up", handleMouseUp);
};

// Remove rectangle drawing event listeners
const removeRectangleDrawing = () => {
  if (!canvasRef.value) return;

  canvasRef.value.off("mouse:down", handleMouseDown);
  canvasRef.value.off("mouse:move", handleMouseMove);
  canvasRef.value.off("mouse:up", handleMouseUp);
};

// Handle mouse down event for rectangle drawing
const handleMouseDown = (options) => {
  if (!isRectMode.value) return;

  isDrawing.value = true;
  const pointer = canvasRef.value.getPointer(options.e);

  // Create new rectangle
  tempRect.value = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 0,
    height: 0,
    fill: "transparent",
    stroke: brushColor.value,
    strokeWidth: brushNum.value,
    selectable: false, // 初始設置為不可選取
    evented: false,
  });

  canvasRef.value.add(tempRect.value);
  canvasRef.value.renderAll();
};

// Handle mouse move event for rectangle drawing
const handleMouseMove = (options) => {
  if (!isRectMode.value || !isDrawing.value || !tempRect.value) return;

  const pointer = canvasRef.value.getPointer(options.e);
  const startX = tempRect.value.left;
  const startY = tempRect.value.top;

  let width = Math.abs(startX - pointer.x);
  let height = Math.abs(startY - pointer.y);

  // Update rectangle position and size
  if (pointer.x < startX) {
    tempRect.value.set("left", pointer.x);
  }
  if (pointer.y < startY) {
    tempRect.value.set("top", pointer.y);
  }

  tempRect.value.set("width", width);
  tempRect.value.set("height", height);

  canvasRef.value.renderAll();
};

// Handle mouse up event for rectangle drawing
const handleMouseUp = () => {
  if (!isRectMode.value || !isDrawing.value) return;

  isDrawing.value = false;
  tempRect.value.setCoords();
  saveState();
  tempRect.value = null;
};
//#endregion

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
  const canvas = document.querySelector("#canvas");
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

    canvasRef.value.freeDrawingBrush.width = brushNum.value;
    canvasRef.value.freeDrawingBrush.color = brushColor.value;

    canvasRef.value.on("mouse:down", function () {
      // saveState();
      if (!isRectMode.value) saveState();
    });

    canvasRef.value.on("mouse:up", function () {
      // saveState();
      if (!isRectMode.value) saveState();
    });

    canvasRef.value.on("path:created", function (e) {
      const path = e.path;
      path.selectable = false;
      path.evented = false;
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
  nextTick(() => document.querySelector("#setColor").click());
};

// 修改畫筆顏色
const selectColor = ({ target }) => {
  canvasRef.value.freeDrawingBrush.color = target.value;
};

const toolType = ref("brush");

// 切換橡皮擦/畫筆狀態
const setTool = (tool) => {
  toolType.value = tool;
  switch (tool) {
    case "eraser":
      isEraserSlider.value = true;
      isRectMode.value = false;

      setObjectsSelectable(false); // 禁止選取
      canvasRef.value.isDrawingMode = true;
      changeAction("eraser");
      break;

    case "brush":
      isEraserSlider.value = false;
      isRectMode.value = false;

      setObjectsSelectable(false); // 禁止選取
      canvasRef.value.isDrawingMode = true;
      changeAction("undoErasing");
      break;

    case "rect":
      isEraserSlider.value = false; //矩形用畫筆粗度
      isRectMode.value = true;
      canvasRef.value.isDrawingMode = false;
      setObjectsSelectable(false); // 禁止選取
      break;

    case "pick":
      isRectMode.value = false;
      canvasRef.value.isDrawingMode = false;
      setObjectsSelectable(true); // 允許選取
      break;

    default:
      console.log("setTool else");
      break;
  }
};

// 新增控制所有物件是否可選取的函數
const setObjectsSelectable = (selectable) => {
  if (!canvasRef.value) return;

  // 設置所有物件的可選取狀態
  canvasRef.value.getObjects().forEach((obj) => {
    if (obj.type !== "image") {
      // 排除背景圖片
      obj.selectable = selectable;
      obj.evented = selectable;
    }
  });

  // 設置整個畫布的選取狀態
  canvasRef.value.selection = selectable;
  canvasRef.value.renderAll();
};

// 打開/關閉畫筆粗細滑塊
const openRangeInput = () => {
  paintBrush.value = !paintBrush.value;
};

// 修改畫筆粗細
const changeBrushNum = () => {
  canvasRef.value.freeDrawingBrush.width = brushNum.value;
  // changeAction(isEraserSlider.value ? "erase" : "undoErasing");
};

// 打開/關閉橡皮擦粗細滑塊
// const openBrushNum = () => {
//   paintEraser.value = !paintEraser.value;
// };

// 修改橡皮擦粗細
const changeEraserNum = () => {
  canvasRef.value.freeDrawingBrush.width = eraserNum.value;
  // changeAction(isEraserSlider.value ? "erase" : "undoErasing");
};

//繪圖/選取
// const pick = () => {
//   canvasRef.value.isDrawingMode = false;
// };

// 修改畫布行為模式
function changeAction(mode) {
  console.log(mode);
  switch (mode) {
    case "eraser":
      canvasRef.value.freeDrawingBrush = new fabric.EraserBrush(
        canvasRef.value
      );
      canvasRef.value.freeDrawingBrush.width = eraserNum.value;
      break;
    case "undoErasing":
      canvasRef.value.freeDrawingBrush = new fabric.PencilBrush(
        canvasRef.value
      );
      canvasRef.value.freeDrawingBrush.color = brushColor.value;
      canvasRef.value.freeDrawingBrush.width = brushNum.value;
      canvasRef.value.freeDrawingBrush.selectable = false;
    default:
      break;
  }
}

// 匯出圖片
const exportImage = () => {
  if (!canvasRef.value) return;

  const dataURL = canvasRef.value.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = dataURL;
  link.click();
};

onMounted(() => {
  // drawCanvas();
});
</script>
