/** @format */

import { getVideoUrl, getVideoInfo } from "./douyin.ts";

const handler = async (req: Request) => {
  console.log("Method:", req.method);

  const url = new URL(req.url);

  // 移除了视频流代理功能，不再需要

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
