// 导入 Next.js 路由链接组件
import Link from "next/link";

// 404 页面未找到组件
// Next.js 会在访问不存在的路由时自动展示此页面
export default function NotFound() {
  return (
    // 页面容器：垂直居中布局，最小高度 50vh，内边距 4
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      {/* 内容居中容器 */}
      <div className="text-center">
        {/* 404 大号数字标识 */}
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        {/* 页面标题 */}
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        {/* 提示说明文字 */}
        <p className="text-base-content/70 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        {/* 操作按钮组 */}
        <div className="flex gap-4 justify-center">
          {/* 返回首页按钮 */}
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
          {/* 浏览技能列表按钮 */}
          <Link href="/skills" className="btn btn-ghost">
            Browse Skills
          </Link>
        </div>
      </div>
    </div>
  );
}