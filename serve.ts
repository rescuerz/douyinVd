/** @format */

import { getVideoUrl, getVideoInfo } from "./douyin.ts";

const handler = async (req: Request) => {
  console.log("Method:", req.method);

  const url = new URL(req.url);

  // 处理视频流代理播放
  if (url.searchParams.has("stream")) {
    const videoUrl = url.searchParams.get("stream")!;
    console.log("Proxying video stream:", videoUrl);

    try {
      const headers = new Headers();
      headers.set(
        "User-Agent",
        "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36"
      );
      headers.set("Referer", "https://www.douyin.com/");

      // 处理Range请求以支持视频流播放
      if (req.headers.get("range")) {
        headers.set("Range", req.headers.get("range")!);
      }

      const response = await fetch(videoUrl, {
        method: "GET",
        headers,
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // 设置流媒体响应头
      const responseHeaders = new Headers();
      responseHeaders.set(
        "Content-Type",
        response.headers.get("Content-Type") || "video/mp4"
      );
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set("Access-Control-Allow-Headers", "Range");
      responseHeaders.set(
        "Access-Control-Expose-Headers",
        "Content-Range, Content-Length"
      );

      // 复制重要的流媒体头部
      if (response.headers.get("Content-Range")) {
        responseHeaders.set(
          "Content-Range",
          response.headers.get("Content-Range")!
        );
      }
      if (response.headers.get("Content-Length")) {
        responseHeaders.set(
          "Content-Length",
          response.headers.get("Content-Length")!
        );
      }
      if (response.headers.get("Accept-Ranges")) {
        responseHeaders.set(
          "Accept-Ranges",
          response.headers.get("Accept-Ranges")!
        );
      }

      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error("Video stream proxy error:", error);
      return new Response("视频流代理失败", { status: 500 });
    }
  }

  // 处理视频代理下载
  if (url.searchParams.has("download")) {
    const videoUrl = url.searchParams.get("download")!;
    console.log("Proxying video download:", videoUrl);

    try {
      const headers = new Headers();
      headers.set(
        "User-Agent",
        "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36"
      );
      headers.set("Referer", "https://www.douyin.com/");

      const response = await fetch(videoUrl, {
        method: "GET",
        headers,
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // 设置下载响应头
      const responseHeaders = new Headers();
      responseHeaders.set(
        "Content-Type",
        response.headers.get("Content-Type") || "video/mp4"
      );
      responseHeaders.set(
        "Content-Disposition",
        "attachment; filename=douyin_video.mp4"
      );
      responseHeaders.set("Access-Control-Allow-Origin", "*");

      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error("Video proxy error:", error);
      return new Response("视频下载失败", { status: 500 });
    }
  }

  if (url.searchParams.has("url")) {
    const inputUrl = url.searchParams.get("url")!;
    console.log("inputUrl:", inputUrl);
    // 返回完成json数据
    if (url.searchParams.has("data")) {
      const videoInfo = await getVideoInfo(inputUrl);
      return new Response(JSON.stringify(videoInfo));
    }
    const videoUrl = await getVideoUrl(inputUrl);
    return new Response(videoUrl);
  } else {
    return new Response("请提供url参数");
  }
};

export { handler };
