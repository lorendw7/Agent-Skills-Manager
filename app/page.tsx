import Link from "next/link";

/**
 * HomePage
 *
 * 网站首页 / 落地页。
 *
 * Landing Page - SSG（Static Site Generation）
 *
 * 这个页面会在项目构建时静态生成，
 * 适合展示变化不频繁的内容，例如首页、介绍页、营销页等。
 *
 * 主要内容：
 * 1. Hero 首屏介绍区域
 * 2. 渲染策略说明区域
 * 3. 技术栈展示区域
 */
export default function HomePage() {
  return (
    /**
     * 页面最外层容器
     *
     * min-h-[calc(100vh-8rem)]：
     * 设置页面最小高度为视口高度减去 8rem。
     * 通常用于预留 Header 和 Footer 的空间，
     * 让页面主体区域保持较好的视觉高度。
     */
    <div className="min-h-[calc(100vh-8rem)]">
      {/**
       * Hero Section
       *
       * 首页首屏区域。
       *
       * 用于展示产品核心卖点、简短介绍和主要操作按钮。
       */}
      <section className="hero min-h-[60vh] bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20">
        {/**
         * hero-content：
         * DaisyUI 提供的 Hero 内容容器样式。
         *
         * text-center：
         * 让内部文字居中显示。
         */}
        <div className="hero-content text-center">
          {/**
           * 内容宽度限制
           *
           * max-w-2xl：
           * 限制文本区域最大宽度，
           * 避免在大屏幕上文字过长影响阅读。
           */}
          <div className="max-w-2xl">
            {/**
             * 主标题
             *
             * text-5xl：
             * 设置大字号，用于突出首页核心信息。
             *
             * font-bold：
             * 加粗标题。
             */}
            <h1 className="text-5xl font-bold">
              Build & Share{" "}
              {/**
               * 使用主题主色突出关键词 Agent Skills
               */}
              <span className="text-primary">Agent Skills</span>
            </h1>

            {/**
             * 产品介绍文案
             *
             * py-6：
             * 设置上下内边距，让文案和标题、按钮之间有足够间距。
             *
             * text-lg：
             * 设置较大的正文文本。
             *
             * opacity-80：
             * 降低透明度，让说明文字层级弱于标题。
             */}
            <p className="py-6 text-lg opacity-80">
              Create powerful AI agent skills using markdown. Share them
              publicly or keep them private. Built with Next.js 16, Prisma, and
              modern rendering strategies.
            </p>

            {/**
             * 首页主要操作按钮区域
             *
             * flex：
             * 使用 Flex 布局。
             *
             * gap-4：
             * 按钮之间设置间距。
             *
             * justify-center：
             * 让按钮组居中显示。
             */}
            <div className="flex gap-4 justify-center">
              {/**
               * 跳转到技能浏览页
               *
               * Link：
               * Next.js 提供的客户端路由跳转组件。
               *
               * btn btn-primary btn-lg：
               * DaisyUI 按钮样式，主按钮、大尺寸。
               */}
              <Link href="/skills" className="btn btn-primary btn-lg">
                Browse Skills
              </Link>

              {/**
               * 跳转到注册页
               *
               * btn-outline：
               * 使用描边按钮样式，作为次级操作。
               */}
              <Link href="/register" className="btn btn-outline btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/**
       * Features Section
       *
       * 功能说明区域。
       *
       * 这里主要展示项目中演示的四种 Next.js 渲染策略：
       * SSG、ISR、SSR、CSR。
       */}
      <section className="py-16 px-4">
        {/**
         * container mx-auto：
         * 设置内容最大宽度并水平居中。
         */}
        <div className="container mx-auto">
          {/**
           * 区域标题
           */}
          <h2 className="text-3xl font-bold text-center mb-12">
            Rendering Strategies Demonstrated
          </h2>

          {/**
           * 卡片网格布局
           *
           * grid：
           * 使用 CSS Grid 布局。
           *
           * md:grid-cols-2：
           * 中等屏幕下显示两列。
           *
           * lg:grid-cols-4：
           * 大屏幕下显示四列。
           *
           * gap-6：
           * 卡片之间的间距。
           */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/**
             * SSG 卡片
             *
             * SSG：Static Site Generation，静态站点生成。
             * 页面在 build 阶段生成 HTML，访问速度快，适合不频繁变化的页面。
             */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-primary">📄 SSG</h3>
                <p>
                  Static Site Generation. This landing page is built at compile
                  time for maximum performance.
                </p>

                {/**
                 * badge：
                 * DaisyUI 徽章样式。
                 *
                 * 表示当前首页就是 SSG 示例页面。
                 */}
                <div className="badge badge-outline">This Page</div>
              </div>
            </div>

            {/**
             * ISR 卡片
             *
             * ISR：Incremental Static Regeneration，增量静态再生成。
             * 可以在不重新部署整个项目的情况下，定期刷新静态页面内容。
             */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-secondary">🔄 ISR</h3>
                <p>
                  Incremental Static Regeneration. Skills gallery revalidates
                  every 60 seconds for fresh content.
                </p>

                {/**
                 * /skills 页面用于演示 ISR。
                 */}
                <div className="badge badge-outline">/skills</div>
              </div>
            </div>

            {/**
             * SSR 卡片
             *
             * SSR：Server-Side Rendering，服务端渲染。
             * 每次请求时在服务端生成页面，适合需要读取 Cookie、
             * 鉴权状态或实时数据的页面。
             */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-accent">⚡ SSR</h3>
                <p>
                  Server-Side Rendering. Dashboard uses cookies for auth,
                  rendering fresh data per request.
                </p>

                {/**
                 * /dashboard 页面用于演示 SSR。
                 */}
                <div className="badge badge-outline">/dashboard</div>
              </div>
            </div>

            {/**
             * CSR 卡片
             *
             * CSR：Client-Side Rendering，客户端渲染。
             * 页面交互逻辑主要在浏览器端完成，
             * 适合表单、编辑器、动态交互组件等场景。
             */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-warning">🎯 CSR</h3>
                <p>
                  Client-Side Rendering. Auth forms and skill editor use React
                  state on the client.
                </p>

                {/**
                 * /login 和 /new 页面用于演示 CSR。
                 */}
                <div className="badge badge-outline">/login, /new</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/**
       * Tech Stack Section
       *
       * 技术栈展示区域。
       *
       * 用徽章形式展示项目使用到的主要技术。
       */}
      <section className="py-12 bg-base-200">
        <div className="container mx-auto px-4 text-center">
          {/**
           * 技术栈区域标题
           */}
          <h2 className="text-2xl font-bold mb-8">Tech Stack</h2>

          {/**
           * 技术栈徽章列表
           *
           * flex flex-wrap：
           * 使用弹性布局，并允许换行。
           *
           * justify-center：
           * 徽章居中排列。
           *
           * gap-4：
           * 徽章之间设置间距。
           */}
          <div className="flex flex-wrap justify-center gap-4">
            {/**
             * Next.js 16：
             * 项目的 React 全栈框架。
             */}
            <div className="badge badge-lg badge-primary gap-2">Next.js 16</div>

            {/**
             * React 19：
             * 用于构建用户界面的核心库。
             */}
            <div className="badge badge-lg badge-secondary gap-2">React 19</div>

            {/**
             * Prisma 7：
             * ORM 工具，用于操作数据库。
             */}
            <div className="badge badge-lg badge-accent gap-2">Prisma 7</div>

            {/**
             * PostgreSQL：
             * 关系型数据库。
             */}
            <div className="badge badge-lg badge-info gap-2">PostgreSQL</div>

            {/**
             * DaisyUI：
             * 基于 Tailwind CSS 的 UI 组件库。
             */}
            <div className="badge badge-lg badge-success gap-2">DaisyUI</div>

            {/**
             * Tailwind CSS 4：
             * 原子化 CSS 框架，用于快速编写样式。
             */}
            <div className="badge badge-lg gap-2">Tailwind CSS 4</div>
          </div>
        </div>
      </section>
    </div>
  );
}