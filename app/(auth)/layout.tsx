/**
 * AuthLayout
 *
 * 认证页面的统一布局组件。
 * 通常用于登录页、注册页、忘记密码页等页面。
 *
 * 作用：
 * 1. 让认证相关页面在屏幕中居中显示
 * 2. 提供统一的卡片样式
 * 3. 通过 children 渲染具体页面内容
 */
export default function AuthLayout({
  children,
}: {
  /**
   * children 表示被 AuthLayout 包裹的子内容
   * 例如 login/page.tsx 或 register/page.tsx 中的表单组件
   */
  children: React.ReactNode;
}) {
  return (
    /**
     * 外层容器
     *
     * min-h-[calc(100vh-8rem)]：
     * 设置最小高度为视口高度减去 8rem，
     * 通常用于避开顶部导航栏和底部留白。
     *
     * flex items-center justify-center：
     * 使用 Flex 布局，让内部卡片水平和垂直居中。
     *
     * p-4：
     * 给小屏幕留出内边距，避免卡片贴边。
     */
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      {/**
       * 卡片容器
       *
       * card：
       * DaisyUI 的卡片样式类。
       *
       * w-full max-w-md：
       * 宽度占满父容器，但最大宽度限制为 md，
       * 适合登录、注册这类窄表单页面。
       *
       * shadow-xl：
       * 添加较明显的阴影，让卡片有层次感。
       */}
      <div className="card w-full max-w-md shadow-xl">
        {/**
         * 卡片内容区域
         *
         * card-body：
         * DaisyUI 的卡片主体样式，
         * 会自动提供合适的内边距和排版。
         *
         * children：
         * 这里渲染具体认证页面的内容，
         * 比如登录表单、注册表单等。
         */}
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}