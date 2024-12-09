import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    Pages({
      extensions: ["vue"],
      exclude: ["**/components/**"],
    }),

    Layouts({
      layoutsDirs:'src/layouts',
      defaultLayout:'default'
    }),

    AutoImport({
      imports: ["vue", "vue-router"], // 自動導入 Vue 和 Vue Router 的 API
      dts: true,
      dirs: ["src/hooks", "src/composables", "src/store"],
      resolvers: [ElementPlusResolver()],
    }),

    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],
      dts: true,
      resolvers: [ElementPlusResolver({importStyle:"sass"})],
    }),
  ],
  css:{
    preprocessorOptions:{
      scss:{
        additionalData:`
          @use "@/styles/element-plus.scss" as *;
        `
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
});
