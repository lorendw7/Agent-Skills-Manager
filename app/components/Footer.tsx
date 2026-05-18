/**
 * Footer
 *
 * 全站底部组件。
 *
 * 作用：
 * 1. 在所有页面底部展示统一的说明信息
 * 2. 展示项目使用的技术栈
 * 3. 简单说明项目用于演示 Next.js 的多种渲染模式
 */
export default function Footer() {
  return (
    /**
     * footer 底部容器
     *
     * footer：
     * DaisyUI 的 Footer 组件基础样式。
     *
     * footer-center：
     * 让 Footer 内容居中显示。
     *
     * bg-base-200：
     * 使用 DaisyUI 当前主题中的基础背景色。
     *
     * text-base-content：
     * 使用主题中的基础文本颜色。
     *
     * p-4：
     * 设置内边距，让内容不要贴边。
     */
    <footer className="footer footer-center bg-base-200 text-base-content p-4">
      {/**
       * aside
       *
       * 语义化标签，通常用于页面的附加说明信息。
       * 在这里用于展示项目说明。
       */}
      <aside>
        {/**
         * 底部说明文字
         *
         * 表示当前项目基于 Next.js 16 和 DaisyUI 构建，
         * 并用于演示 SSG、SSR、ISR、CSR 等渲染模式。
         */}
        <p>
          Built with Next.js 16 + DaisyUI — Demonstrating SSG, SSR, ISR, and CSR
          patterns
        </p>
      </aside>
    </footer>
  );
}