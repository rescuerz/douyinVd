<!-- @format -->

# 抖音无水印视频(图文)下载服务

## 📌 功能说明

通过提供的抖音视频或者图文链接，获取对应的无水印视频(图片)链接。

### 🔧 请求方式

- **方法**：GET
- **地址**：`https://yourdomain?url=https://v.douyin.com/xxxx/`
- **参数说明**：
  - `url`: 抖音视频分享链接
  - `data`: 启用 json 数据返回，请求链接如下 https://yourdomain?data&url=https://v.douyin.com/xxxx

### 📤 返回结果

1. 无 data 参数

   > 返回解析后的无水印视频直链（URL）。

2. 有 data 参数

返回 json 数据结构如下

```ts
interface DouyinVideoInfo {
  // ID
  aweme_id: string | null;
  // 评论数
  comment_count: number | null;
  // 点赞数
  digg_count: number | null;
  // 分享数
  share_count: number | null;
  // 收藏数
  collect_count: number | null;
  // 作者昵称
  nickname: string | null;
  // 作者签名
  signature: string | null;
  // 标题
  desc: string | null;
  // 创建时间
  create_time: string | null;
  // 视频链接
  video_url: string | null;
  // 类型
  type: string | null;
  // 图片链接列表
  image_url_list: string[] | null;
}
```

---

## 🚀 部署方式

本项目支持多种部署方式，方便快速上线使用。

### 1. Docker 部署（推荐）

#### 快速开始

1. **克隆项目**

   ```bash
   git clone <your-repo-url>
   cd douyinVd
   ```

2. **一键启动**

   ```bash
   # 快速启动（推荐）
   ./quick-start.sh
   ```

3. **手动启动**
   ```bash
   # 构建并启动服务
   docker-compose -f docker-compose.yml up -d --build
   ```

#### 访问服务

启动成功后，在浏览器中访问：http://localhost:8000


#### 常用命令

```bash
# 查看服务状态
docker-compose -f docker-compose.yml ps

# 查看日志
docker-compose -f docker-compose.yml logs -f

# 停止服务
docker-compose -f docker-compose.yml down

# 重启服务
docker-compose -f docker-compose.yml restart
```

## 📈 Stars 趋势

[![Star History Chart](https://api.star-history.com/svg?repos=pwh-pwh/douyinVd&type=Date)](https://star-history.com/#pwh-pwh/douyinVd&Date)
