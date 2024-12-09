<template>
    <div class="drawing-board">
      <div class="toolbar mb-4 flex items-center gap-2">
        <!-- 圖片上傳 -->
        <el-upload
          class="upload-btn"
          :show-file-list="false"
          accept="image/*"
          :auto-upload="false"
          :on-change="handleImageUpload"
        >
          <el-button type="primary">上傳圖片</el-button>
        </el-upload>
  
        <!-- 工具選擇 -->
        <el-button
          :class="{ 'is-active': currentTool === 'brush' }"
          @click="setTool('brush')"
        >
          畫筆
        </el-button>
  
        <el-button
          :class="{ 'is-active': currentTool === 'rect' }"
          @click="setTool('rect')"
        >
          矩形
        </el-button>
  
        <!-- 顏色選擇器 -->
        <el-color-picker
          v-model="currentColor"
          @change="updateColor"
        />
  
        <!-- 匯出按鈕 -->
        <el-button
          type="success"
          @click="exportImage"
          :disabled="!hasImage"
        >
          匯出圖片
        </el-button>
      </div>
  
      <!-- 提示訊息 -->
      <el-alert
        v-if="!hasImage"
        title="請先上傳圖片"
        type="info"
        class="mb-4"
      />
  
      <!-- 畫布容器 -->
      <div 
        ref="canvasContainer" 
        class="canvas-container"
      >
        <canvas
          ref="canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
        ></canvas>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { ElMessage } from 'element-plus'
  
  // 響應式狀態
  const canvas = ref(null)
  const canvasContainer = ref(null)
  const context = ref(null)
  const isDrawing = ref(false)
  const currentTool = ref('brush')
  const currentColor = ref('#000000')
  const hasImage = ref(false)
  const startPoint = ref({ x: 0, y: 0 })
  const currentShape = ref(null)
  
  // 初始化畫布
  const initCanvas = () => {
    if (!canvas.value || !canvasContainer.value) return
  
    const container = canvasContainer.value
    canvas.value.width = container.clientWidth
    canvas.value.height = container.clientHeight
  
    context.value = canvas.value.getContext('2d')
    context.value.lineCap = 'round'
    context.value.lineJoin = 'round'
    context.value.lineWidth = 2
    context.value.strokeStyle = currentColor.value
  
    // 設置白色背景
    context.value.fillStyle = '#ffffff'
    context.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
  }
  
  // 處理圖片上傳
  const handleImageUpload = (file) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        if (!canvas.value || !context.value) return
  
        // 清除畫布
        context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
        
        // 計算縮放比例
        const scale = Math.min(
          canvas.value.width / img.width,
          canvas.value.height / img.height
        )
        
        // 計算居中位置
        const x = (canvas.value.width - img.width * scale) / 2
        const y = (canvas.value.height - img.height * scale) / 2
        
        // 繪製圖片
        context.value.drawImage(
          img,
          x,
          y,
          img.width * scale,
          img.height * scale
        )
        
        hasImage.value = true
        ElMessage.success('圖片上傳成功')
      }
      
      img.src = e.target.result
    }
    
    reader.readAsDataURL(file.raw)
  }
  
  // 更新顏色
  const updateColor = (color) => {
    if (context.value) {
      context.value.strokeStyle = color
    }
  }
  
  // 設置工具
  const setTool = (tool) => {
    currentTool.value = tool
  }
  
  // 開始繪製
  const startDrawing = (e) => {
    isDrawing.value = true
    const rect = canvas.value.getBoundingClientRect()
    startPoint.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  
    if (currentTool.value === 'brush') {
      context.value.beginPath()
      context.value.moveTo(startPoint.value.x, startPoint.value.y)
    }
  }
  
  // 繪製過程
  const draw = (e) => {
    if (!isDrawing.value || !context.value) return
  
    const rect = canvas.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
  
    if (currentTool.value === 'brush') {
      context.value.lineTo(x, y)
      context.value.stroke()
    } else if (currentTool.value === 'rect') {
      // 保存當前畫布狀態
      const imageData = context.value.getImageData(
        0,
        0,
        canvas.value.width,
        canvas.value.height
      )
      
      // 清除之前的矩形
      context.value.clearRect(
        0,
        0,
        canvas.value.width,
        canvas.value.height
      )
      
      // 恢復畫布狀態
      context.value.putImageData(imageData, 0, 0)
      
      // 繪製新矩形
      context.value.beginPath()
      context.value.strokeRect(
        startPoint.value.x,
        startPoint.value.y,
        x - startPoint.value.x,
        y - startPoint.value.y
      )
    }
  }
  
  // 停止繪製
  const stopDrawing = () => {
    isDrawing.value = false
    if (currentTool.value === 'brush') {
      context.value.closePath()
    }
  }
  
  // 匯出圖片
  const exportImage = () => {
    if (!canvas.value) return
    
    const dataURL = canvas.value.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = dataURL
    link.click()
  }
  
  // 生命週期鉤子
  onMounted(() => {
    initCanvas()
    
    // 監聽視窗大小變化
    window.addEventListener('resize', initCanvas)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', initCanvas)
  })
  </script>
  
  <style scoped>
  .drawing-board {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .toolbar {
    padding: 8px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #fff;
  }
  
  .canvas-container {
    flex: 1;
    min-height: 600px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .is-active {
    background-color: #409eff;
    color: white;
  }
  </style>