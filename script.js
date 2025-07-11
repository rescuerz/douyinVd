/** @format */

document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const videoUrlInput = document.getElementById("videoUrl");
  const parseBtn = document.getElementById("parseBtn");
  const clearBtn = document.getElementById("clearBtn");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const resultContainer = document.getElementById("resultContainer");
  const videoPlayer = document.getElementById("videoPlayer");
  const imageContainer = document.getElementById("imageContainer");
  const playBtn = document.getElementById("playBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const shareBtn = document.getElementById("shareBtn");
  const newParseBtn = document.getElementById("newParseBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const pipBtn = document.getElementById("pipBtn");
  const videoInfo = document.getElementById("videoInfo");
  const toastContainer = document.getElementById("toastContainer");
  const downloadModal = document.getElementById("downloadModal");
  const closeModal = document.getElementById("closeModal");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const progressStatus = document.getElementById("progressStatus");

  // 视频信息元素
  const originalUrl = document.getElementById("originalUrl");
  const videoTitle = document.getElementById("videoTitle");
  const videoAuthor = document.getElementById("videoAuthor");
  const publishTime = document.getElementById("publishTime");
  const likeCount = document.getElementById("likeCount");
  const commentCount = document.getElementById("commentCount");

  // 状态变量
  let currentVideoUrl = "";
  let currentVideoData = null;
  let isLoading = false;

  // 初始化
  init();

  function init() {
    // 绑定事件监听器
    bindEventListeners();

    // 检查剪贴板权限
    checkClipboardPermission();

    // 设置输入框焦点
    videoUrlInput.focus();
  }

  function bindEventListeners() {
    // 输入框事件
    videoUrlInput.addEventListener("input", handleInputChange);
    videoUrlInput.addEventListener("paste", handlePaste);
    videoUrlInput.addEventListener("keypress", handleKeyPress);

    // 按钮事件
    parseBtn.addEventListener("click", handleParseClick);
    clearBtn.addEventListener("click", handleClearClick);
    playBtn.addEventListener("click", handlePlayClick);
    downloadBtn.addEventListener("click", handleDownloadClick);
    copyLinkBtn.addEventListener("click", handleCopyClick);
    shareBtn.addEventListener("click", handleShareClick);
    newParseBtn.addEventListener("click", handleNewParseClick);
    fullscreenBtn.addEventListener("click", handleFullscreenClick);
    pipBtn.addEventListener("click", handlePipClick);
    closeModal.addEventListener("click", handleCloseModal);

    // 视频播放器事件
    videoPlayer.addEventListener("loadstart", handleVideoLoadStart);
    videoPlayer.addEventListener("loadeddata", handleVideoLoaded);
    videoPlayer.addEventListener("error", handleVideoError);
  }

  function handleInputChange() {
    const hasValue = videoUrlInput.value.trim().length > 0;
    clearBtn.classList.toggle("visible", hasValue);

    // 验证URL格式
    const url = videoUrlInput.value.trim();
    if (url && !isValidDouyinUrl(url)) {
      videoUrlInput.style.borderColor = "#ef4444";
    } else {
      videoUrlInput.style.borderColor = "";
    }
  }

  function handlePaste(e) {
    setTimeout(() => {
      const pastedText = videoUrlInput.value.trim();
      if (isValidDouyinUrl(pastedText)) {
        showToast("检测到抖音链接，点击解析按钮开始处理", "success");
        parseBtn.focus();
      }
    }, 100);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !isLoading) {
      handleParseClick();
    }
  }

  function handleClearClick() {
    videoUrlInput.value = "";
    clearBtn.classList.remove("visible");
    videoUrlInput.focus();
    videoUrlInput.style.borderColor = "";
  }

  function handleParseClick() {
    if (isLoading) return;

    const url = videoUrlInput.value.trim();

    if (!url) {
      showToast("请输入抖音视频链接", "warning");
      videoUrlInput.focus();
      return;
    }

    if (!isValidDouyinUrl(url)) {
      showToast("请输入有效的抖音链接", "error");
      videoUrlInput.focus();
      return;
    }

    startParsing(url);
  }

  // 工具函数
  function isValidDouyinUrl(url) {
    return url.includes("douyin.com") || url.includes("iesdouyin.com");
  }

  function checkClipboardPermission() {
    if (navigator.clipboard && navigator.clipboard.readText) {
      // 可以尝试读取剪贴板
      navigator.clipboard
        .readText()
        .then((text) => {
          if (isValidDouyinUrl(text) && !videoUrlInput.value) {
            showToast(
              "检测到剪贴板中的抖音链接，是否自动填入？",
              "info",
              5000,
              [
                {
                  text: "填入",
                  action: () => {
                    videoUrlInput.value = text;
                    handleInputChange();
                  },
                },
              ]
            );
          }
        })
        .catch(() => {
          // 忽略权限错误
        });
    }
  }

  function startParsing(url) {
    isLoading = true;
    parseBtn.disabled = true;
    parseBtn.querySelector(".btn-text").textContent = "解析中...";

    // 显示加载指示器
    loadingIndicator.classList.remove("hidden");
    resultContainer.classList.add("hidden");
    videoInfo.classList.add("hidden");

    // 模拟加载步骤
    simulateLoadingSteps();

    // 调用API获取视频信息
    fetchVideoInfo(url);
  }

  function simulateLoadingSteps() {
    const steps = document.querySelectorAll(".step");
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        steps[currentStep].classList.add("active");
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  // 事件处理函数
  function handlePlayClick() {
    if (!currentVideoUrl) return;

    if (currentVideoData && currentVideoData.type === "video") {
      // 滚动到视频播放器位置
      videoPlayer.scrollIntoView({ behavior: "smooth", block: "center" });

      // 开始播放视频
      videoPlayer
        .play()
        .then(() => {
          showToast("开始播放视频", "success");
        })
        .catch((error) => {
          console.error("播放失败:", error);
          showToast("视频播放失败，请尝试下载", "error");
        });
    } else if (currentVideoData && currentVideoData.type === "img") {
      showToast("这是图片内容，无法播放", "info");
    }
  }

  function handleDownloadClick() {
    if (!currentVideoUrl) return;

    if (currentVideoData && currentVideoData.type === "img") {
      downloadImages();
    } else {
      downloadVideo();
    }
  }

  function downloadVideo() {
    showDownloadModal();
    updateDownloadProgress(0);

    // 使用代理下载
    try {
      const proxyUrl = `?download=${encodeURIComponent(currentVideoUrl)}`;

      const a = document.createElement("a");
      a.href = proxyUrl;
      a.download = generateFileName("video");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 更新进度到100%
      updateDownloadProgress(100);

      setTimeout(() => {
        hideDownloadModal();
        showToast("视频下载已开始！", "success");
      }, 1000);
    } catch (error) {
      console.error("Download error:", error);
      hideDownloadModal();
      showToast("下载失败，请尝试复制链接手动下载", "error");
    }
  }

  function downloadImages() {
    if (!currentVideoData.image_url_list) return;

    showToast("开始下载图片...", "info");

    currentVideoData.image_url_list.forEach((imageUrl, index) => {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = generateFileName("image", index + 1);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    showToast(
      `已开始下载 ${currentVideoData.image_url_list.length} 张图片`,
      "success"
    );
  }

  function generateFileName(type, index = "") {
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:-]/g, "");
    const title = currentVideoData?.desc
      ? currentVideoData.desc.slice(0, 20).replace(/[^\w\u4e00-\u9fa5]/g, "")
      : "douyin";

    if (type === "video") {
      return `${title}_${timestamp}.mp4`;
    } else {
      return `${title}_${timestamp}_${index}.jpg`;
    }
  }

  function handleCopyClick() {
    if (!currentVideoUrl) return;

    navigator.clipboard
      .writeText(currentVideoUrl)
      .then(() => {
        showToast("视频链接已复制到剪贴板", "success");
      })
      .catch((err) => {
        console.error("复制失败:", err);
        showToast("复制失败，请手动复制", "error");
      });
  }

  function handleShareClick() {
    if (!currentVideoUrl) return;

    if (navigator.share) {
      navigator
        .share({
          title: currentVideoData?.desc || "抖音视频",
          text: "分享一个有趣的抖音视频",
          url: currentVideoUrl,
        })
        .catch((err) => {
          console.log("分享取消或失败:", err);
        });
    } else {
      // 降级到复制链接
      handleCopyClick();
    }
  }

  function handleNewParseClick() {
    // 重置状态
    currentVideoUrl = "";
    currentVideoData = null;
    isLoading = false;

    // 重置UI
    videoUrlInput.value = "";
    handleClearClick();
    resultContainer.classList.add("hidden");
    videoInfo.classList.add("hidden");
    loadingIndicator.classList.add("hidden");

    // 重置按钮状态
    parseBtn.disabled = false;
    parseBtn.querySelector(".btn-text").textContent = "开始解析";

    // 重置加载步骤
    document.querySelectorAll(".step").forEach((step) => {
      step.classList.remove("active");
    });

    videoUrlInput.focus();
  }

  function handleFullscreenClick() {
    if (videoPlayer.requestFullscreen) {
      videoPlayer.requestFullscreen();
    } else if (videoPlayer.webkitRequestFullscreen) {
      videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) {
      videoPlayer.msRequestFullscreen();
    }
  }

  function handlePipClick() {
    if (videoPlayer.requestPictureInPicture) {
      videoPlayer.requestPictureInPicture().catch((err) => {
        showToast("画中画模式不可用", "warning");
      });
    } else {
      showToast("您的浏览器不支持画中画功能", "warning");
    }
  }

  function handleCloseModal() {
    hideDownloadModal();
  }

  function handleVideoLoadStart() {
    showToast("视频开始加载...", "info");
  }

  function handleVideoLoaded() {
    showToast("视频加载完成", "success");
  }

  function handleVideoError() {
    console.error("Video error:", videoPlayer.error);
    showToast(
      "视频预览加载失败，但仍可下载。点击下载按钮获取视频文件。",
      "warning"
    );
  }

  // API调用函数
  async function fetchVideoInfo(url) {
    try {
      // 获取完整信息
      const response = await fetch(`?data&url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error("网络请求失败");
      }

      const data = await response.json();

      // 检查是否成功获取视频URL
      if (!data.video_url && !data.image_url_list) {
        throw new Error("无法获取视频或图片链接");
      }

      // 保存数据
      currentVideoData = data;

      // 更新UI
      updateUI(data, url);
    } catch (error) {
      console.error("获取视频信息失败:", error);
      handleParsingError(error.message);
    }
  }

  function handleParsingError(message) {
    isLoading = false;
    parseBtn.disabled = false;
    parseBtn.querySelector(".btn-text").textContent = "开始解析";

    loadingIndicator.classList.add("hidden");
    showToast("获取视频信息失败: " + message, "error");

    // 重置加载步骤
    document.querySelectorAll(".step").forEach((step) => {
      step.classList.remove("active");
    });
  }

  // 更新UI
  function updateUI(data, originalUrlValue) {
    // 隐藏加载指示器
    loadingIndicator.classList.add("hidden");

    // 显示结果容器
    resultContainer.classList.remove("hidden");

    // 处理视频或图片
    if (data.type === "video" && data.video_url) {
      currentVideoUrl = data.video_url;

      // 尝试设置视频源 - 使用代理流
      try {
        const proxyStreamUrl = `?stream=${encodeURIComponent(data.video_url)}`;
        videoPlayer.src = proxyStreamUrl;
        videoPlayer.load();

        // 添加视频加载超时处理
        const loadTimeout = setTimeout(() => {
          console.warn("Video loading timeout, but download should still work");
          showToast("视频预览加载超时，但下载功能正常", "info");
        }, 10000);

        videoPlayer.addEventListener(
          "loadeddata",
          () => {
            clearTimeout(loadTimeout);
          },
          { once: true }
        );
      } catch (error) {
        console.error("Error setting video source:", error);
        showToast("视频预览不可用，但可以正常下载", "info");
      }

      // 视频解析完成，用户可以选择播放或下载
      showToast("视频解析完成！您可以播放或下载视频", "success");
    } else if (
      data.type === "img" &&
      data.image_url_list &&
      data.image_url_list.length > 0
    ) {
      // 如果是图片，创建图片展示
      currentVideoUrl = data.image_url_list[0];
      // 替换视频播放器为图片
      const imgHtml = `<img src="${data.image_url_list[0]}" style="width:100%;height:auto;position:absolute;top:0;left:0;" alt="抖音图片">`;
      videoPlayer.style.display = "none";
      videoPlayer.insertAdjacentHTML("afterend", imgHtml);

      // 图片解析完成，用户可以选择查看或下载
      showToast("图片解析完成！您可以查看或下载图片", "success");
    }

    // 显示视频信息
    if (data.nickname || data.desc) {
      videoInfo.classList.remove("hidden");

      // 填充信息
      originalUrl.textContent = originalUrlValue;
      videoTitle.textContent = data.desc || "无标题";
      videoAuthor.textContent = data.nickname || "未知作者";
      publishTime.textContent = data.create_time || "未知时间";
      likeCount.textContent = formatNumber(data.digg_count) || "0";
      commentCount.textContent = formatNumber(data.comment_count) || "0";
    }
  }

  // 格式化数字
  function formatNumber(num) {
    if (!num) return "0";

    if (num >= 10000) {
      return (num / 10000).toFixed(1) + "万";
    }

    return num.toString();
  }

  // 显示提示信息
  function showAlert(message) {
    const alertBox = document.createElement("div");
    alertBox.className = "alert-box";
    alertBox.textContent = message;

    // 添加样式
    alertBox.style.position = "fixed";
    alertBox.style.top = "20px";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translateX(-50%)";
    alertBox.style.padding = "10px 20px";
    alertBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    alertBox.style.color = "white";
    alertBox.style.borderRadius = "4px";
    alertBox.style.zIndex = "1000";

    document.body.appendChild(alertBox);

    // 3秒后移除
    setTimeout(() => {
      alertBox.style.opacity = "0";
      alertBox.style.transition = "opacity 0.5s";

      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 500);
    }, 3000);
  }

  // UI工具函数
  function showToast(message, type = "info", duration = 3000, actions = []) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const content = document.createElement("div");
    content.textContent = message;
    toast.appendChild(content);

    if (actions.length > 0) {
      const actionContainer = document.createElement("div");
      actionContainer.style.marginTop = "10px";

      actions.forEach((action) => {
        const button = document.createElement("button");
        button.textContent = action.text;
        button.style.marginRight = "10px";
        button.style.padding = "5px 10px";
        button.style.border = "none";
        button.style.borderRadius = "4px";
        button.style.background = "#007bff";
        button.style.color = "white";
        button.style.cursor = "pointer";
        button.onclick = () => {
          action.action();
          removeToast(toast);
        };
        actionContainer.appendChild(button);
      });

      toast.appendChild(actionContainer);
    }

    toastContainer.appendChild(toast);

    setTimeout(() => {
      removeToast(toast);
    }, duration);
  }

  function removeToast(toast) {
    if (toast && toast.parentNode) {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  function showDownloadModal() {
    downloadModal.classList.remove("hidden");
    updateDownloadProgress(0);
  }

  function hideDownloadModal() {
    downloadModal.classList.add("hidden");
  }

  function updateDownloadProgress(percent) {
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${Math.round(percent)}%`;

    if (percent < 30) {
      progressStatus.textContent = "准备下载...";
    } else if (percent < 70) {
      progressStatus.textContent = "正在下载...";
    } else if (percent < 100) {
      progressStatus.textContent = "即将完成...";
    } else {
      progressStatus.textContent = "下载完成！";
    }
  }

  // 兼容旧的showAlert函数
  function showAlert(message) {
    showToast(message, "info");
  }
});
