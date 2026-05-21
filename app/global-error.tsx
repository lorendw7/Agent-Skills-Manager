// 声明这是客户端组件（在浏览器中运行）
"use client";

// 全局错误边界组件
// 捕获整个应用范围内未处理的错误，并展示友好的错误页面
export default function GlobalError({
  error,   // 错误对象，包含错误信息
  reset,   // 重置函数，尝试重新渲染出错的页面
}: {
  // 定义 error 类型：标准 Error + 可选的 digest（错误唯一标识）
  error: Error & { digest?: string };
  // 定义 reset 类型：无参数、无返回值的函数
  reset: () => void;
}) {
  return (
    // 全局错误页面必须包含 html 和 body 标签（Next.js 要求）
    <html>
      <body>
        {/* 页面容器：垂直居中布局，最小高度 50vh */}
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          {/* 错误内容居中展示 */}
          <div className="text-center">
            {/* 错误表情图标 */}
            <div className="text-6xl mb-4">😵</div>
            {/* 错误主标题 */}
            <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
            {/* 错误详情：显示错误信息，无信息时显示默认提示 */}
            <p className="text-base-content/70 mb-4">
              {error.message || "An unexpected error occurred"}
            </p>
            {/* 操作按钮组 */}
            <div className="flex gap-4 justify-center">
              {/* 重试按钮：调用 reset 尝试重新加载页面 */}
              <button onClick={() => reset()} className="btn btn-primary">
                Try again
              </button>
              {/* 返回首页按钮 */}
              <a href="/" className="btn btn-ghost">
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}