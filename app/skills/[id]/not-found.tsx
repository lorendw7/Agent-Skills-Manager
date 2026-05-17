// 导入 Next.js 的 Link 组件，用于客户端导航（无刷新跳转）
import Link from "next/link";

// 默认导出 404 页面组件（文件名固定为 not-found.tsx）
export default function NotFound() {
  return (
    <section className="p-4 my-4 mx-auto max-w-md border border-primary rounded-md text-center">
      {/* 404 错误提示标题 */}
      <h1>404 - Page Not Found</h1>
      {/* 回到首页的链接按钮，使用了自定义的按钮样式类和 Tailwind 外边距类 mt-4 */}
      <Link className="btn btn-outline mt-4" href="/">
        Go to home
      </Link>
    </section>
  );
}