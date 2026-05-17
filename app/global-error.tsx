// 🔴 Next.js 中，全局错误边界必须是客户端组件，所以必须加上 'use client' 指令
'use client' 

// 默认导出全局错误处理组件（文件名固定为 global-error.tsx）
export default function GlobalError({
  // 接收的两个参数：
  error,  // 捕获到的错误对象
  reset,  // 重置错误边界的函数，用于尝试恢复页面
}: {
  // 定义 error 的类型：标准 Error 对象，可选包含 digest（Next.js 内部错误摘要）
  error: Error & { digest?: string }
  // 定义 reset 函数的类型：无参数，无返回值
  reset: () => void
}) {
  return (
    // 🚨 重点：全局错误组件必须包含完整的 <html> 和 <body> 标签
    // 因为它会替换掉根布局（root layout），所以需要手动补全整个HTML文档结构
    <html>
      <body>
        {/* 错误提示标题 */}
        <h2>Something went wrong!</h2>
        
        {/* 点击按钮调用 reset 函数，尝试重新渲染整个应用，恢复页面 */}
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}