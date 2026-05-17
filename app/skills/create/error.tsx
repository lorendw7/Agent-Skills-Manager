// Next.js 中，页面级别的错误组件（error.tsx）必须声明为客户端组件
"use client";

// 默认导出页面级别的错误处理组件（文件名一般为 error.tsx）
export default function Error({
  // 接收的两个参数：
  // error: 捕获到的错误对象
  // reset: 重置错误边界的函数，用于尝试恢复
  error,
  reset,
}: {
  // 定义 error 的类型：标准 JavaScript Error 对象
  error: Error;
  // 定义 reset 函数的类型：无参数，无返回值
  reset: () => void;
}) {
  return (
    // 根容器：使用 Tailwind CSS 类设置居中、内边距样式
    <div className="text-center py-16">
      {/* 错误提示标题 */}
      <h2>Something went wrong!</h2>
      {/* 显示错误的具体信息，方便用户或开发者排查问题 */}
      <p>{error.message}</p>
      {/* 点击按钮调用 reset 函数，尝试重新渲染出错的页面，恢复正常状态 */}
      {/* 使用了自定义的 btn 和 btn-primary 类来设置按钮样式 */}
      <button onClick={reset} className="btn btn-primary">
        Try again
      </button>
    </div>
  );
}