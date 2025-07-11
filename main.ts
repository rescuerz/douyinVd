/** @format */

import { handler } from "./serve.ts";

// 创建一个处理静态文件的处理器
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // 处理API请求
  if (
    url.searchParams.has("url") ||
    url.searchParams.has("download") ||
    url.searchParams.has("data")
  ) {
    return await handler(req);
  }

  // 处理静态文件
  try {
    if (path === "/" || path === "") {
      const indexHtml = await Deno.readFile("./index.html");
      return new Response(indexHtml, {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }

    // 处理CSS和JS文件
    if (path.endsWith(".css")) {
      const css = await Deno.readFile(`.${path}`);
      return new Response(css, {
        headers: {
          "content-type": "text/css; charset=utf-8",
        },
      });
    }

    if (path.endsWith(".js")) {
      const js = await Deno.readFile(`.${path}`);
      return new Response(js, {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
        },
      });
    }

    // 默认返回首页
    const indexHtml = await Deno.readFile("./index.html");
    return new Response(indexHtml, {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  } catch (e) {
    return new Response("找不到请求的资源", { status: 404 });
  }
}

Deno.serve(handleRequest);
