---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 84ef50cc942e354c4f8eb2a8feb413df_d151d337d82411f1a216525400248c00
    ReservedCode1: mUujMshBwa3r5un4jaxvxY1eGllPj+4V2NO5Gmi4O8m6BdVBRfd/t51VMzm7O2Ki22C1iytnSff5ilb55eUofZVUoraw1BfmL0ewinPACVJ5T+QAyYWf0BXCOKrPtP7TJwhw4shpp6t6SdDvxudjuZXFhzO3JM6DlOLFM4OK1EqSjOFT7zmvm1IPzs8=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 84ef50cc942e354c4f8eb2a8feb413df_d151d337d82411f1a216525400248c00
    ReservedCode2: mUujMshBwa3r5un4jaxvxY1eGllPj+4V2NO5Gmi4O8m6BdVBRfd/t51VMzm7O2Ki22C1iytnSff5ilb55eUofZVUoraw1BfmL0ewinPACVJ5T+QAyYWf0BXCOKrPtP7TJwhw4shpp6t6SdDvxudjuZXFhzO3JM6DlOLFM4OK1EqSjOFT7zmvm1IPzs8=
---

# 校园助手 APP（UniApp 版）

超星学习通「移动应用开发」小组作业 —— 基于 UniApp 技术路线实现。

## 一、技术路线

- 框架：UniApp（Vue 3 语法，HBuilderX 工程结构）
- 语言：JavaScript + HTML + CSS（.vue 单文件组件，template/script/style 三段式）
- 数据：uni.setStorageSync / getStorageSync 本地存储持久化
- 网络：uni.request 封装（utils/request.js），可切换远端数据源
- 原生能力：getLocation 定位、chooseImage 相机/相册、vibrate 震动、scanCode 扫码、openLocation 导航

## 二、功能结构

| 页面 | 路径 | 主要功能 | 覆盖知识点 |
|------|------|----------|-----------|
| 主页 | pages/index/index | 宫格入口、今日概览、公告轮播、原生功能演示 | tabBar、跨页数据联动、swiper |
| 课程表 | pages/timetable/timetable | 添加/删除课程、按星期分组展示 | picker、switch、input、本地存储、增删交互 |
| 校园地图 | pages/map/map | 地图组件、建筑标点、定位、外部导航 | map 组件、getLocation、openLocation |
| 失物招领 | pages/lost/lost | 发布寻物/招领、拍照上传、列表展示 | radio、chooseImage、textarea、本地存储 |
| 图书馆座位 | pages/seat/seat | 选座预约、座位状态、我的预约 | checkbox、slider、picker、震动反馈 |
| 校园公告 | pages/notice/notice | 公告列表、关键词搜索、远程请求演示 | input 搜索、uni.request、列表渲染 |
| 公告详情 | pages/notice/detail | 展示公告正文 | 页面传参（onLoad options）、navigateTo |

## 三、运行方式

1. 下载安装 HBuilderX（https://www.dcloud.io/hbuilderx.html）
2. 文件 → 打开目录 → 选择本项目根目录
3. 运行：
   - 浏览器：菜单「运行 → 运行到浏览器 → Chrome」
   - 手机 App：菜单「运行 → 运行到手机或模拟器」
   - 微信小程序：菜单「运行 → 运行到小程序模拟器 → 微信开发者工具」
4. 提交代码：支持 HBuilderX 内置 Git 或命令行提交

## 四、知识点对照（作业要求）

- 主页 + 至少 5 个子页面：✅ 主页 + 课程表/校园地图/失物招领/图书馆座位/校园公告（共 5 个 tabBar 页 + 详情页）
- 常用控件：✅ button / input / textarea / picker / switch / slider / radio / checkbox / swiper / map
- 数据绑定：✅ v-model 双向绑定 + 模板插值
- 页面传参：✅ 列表页 → 详情页 onLoad 接收 id 参数
- 本地存储：✅ uni.setStorageSync 持久化课程、失物、预约数据
- 网络请求：✅ uni.request 封装 + 远端加载演示
- 原生功能：✅ 定位 / 相机拍照 / 震动 / 扫码 / 地图导航
- Git：✅ 项目可直接提交至远程仓库

## 五、目录结构

```
campus-assistant/
├── pages.json          # 页面路由与 tabBar 配置
├── manifest.json       # 应用配置与原生权限
├── App.vue             # 全局生命周期与样式
├── main.js             # 入口文件
├── uni.scss            # 公共样式变量
├── index.html          # H5 端入口
├── pages/
│   ├── index/index.vue
│   ├── timetable/timetable.vue
│   ├── map/map.vue
│   ├── lost/lost.vue
│   ├── seat/seat.vue
│   └── notice/{notice.vue, detail.vue}
└── utils/
    ├── store.js        # 本地存储封装
    └── request.js      # 网络请求封装
```

## 六、加分项（可选）

1. 后端接口：用 Python Flask 搭建简单接口（类似 ISYS3001 项目经验），把公告/失物数据存 SQLite，前端 uni.request 拉取
2. 发布小程序：申请微信小程序 AppID 填入 manifest.json 即可编译发布
3. 打包 App：HBuilderX → 发行 → 原生 App 云打包（需 DCloud 账号）
*（内容由AI生成，仅供参考）*
