import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

/**
 * 加载 Geist Sans 字体
 *
 * variable：
 * 将字体绑定到 CSS 变量 --font-geist-sans，
 * 方便在 Tailwind / CSS 中统一使用。
 *
 * subsets：
 * 指定加载 latin 字符集，减少字体文件体积。
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * 加载 Geist Mono 等宽字体
 *
 * 通常用于代码、数字、技术类文本展示。
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 页面元信息配置
 *
 * Next.js App Router 中可以通过 metadata
 * 统一配置页面标题、描述、Open Graph 信息等。
 *
 * 这些信息会被浏览器、搜索引擎、社交平台读取。
 */
export const metadata: Metadata = {
  /**
   * 网站标题
   *
   * 会显示在浏览器标签页中，
   * 也会作为默认 SEO 标题。
   */
  title: "Agent Skills Manager",

  /**
   * 网站描述
   *
   * 用于 SEO，也可能显示在搜索结果摘要中。
   */
  description:
    "Create, manage, and share AI agent skills. A Next.js demo showcasing SSG, SSR, ISR, and CSR patterns with Prisma and DaisyUI.",

  /**
   * Open Graph 配置
   *
   * 当网页被分享到社交平台、聊天工具时，
   * 平台通常会读取这里的信息生成分享卡片。
   */
  openGraph: {
    title: "Agent Skills Manager",
    description: "Create, manage, and share AI agent skills publicly",
    type: "website",
  },
};

/**
 * RootLayout
 *
 * Next.js App Router 的根布局组件。
 *
 * 作用：
 * 1. 定义整个应用的 HTML 结构
 * 2. 加载全局字体和全局样式
 * 3. 统一包裹 Header、Footer、Providers
 * 4. 通过 children 渲染当前路由对应的页面内容
 *
 * 这个组件通常位于 app/layout.tsx。
 */
export default function RootLayout({
  children,
}: Readonly<{
  /**
   * children 表示当前路由页面内容
   *
   * 例如：
   * app/page.tsx
   * app/login/page.tsx
   * app/dashboard/page.tsx
   *
   * 都会被渲染到这里。
   */
  children: React.ReactNode;
}>) {
  return (
    /**
     * html 根标签
     *
     * lang="en"：
     * 声明页面主要语言为英文。
     *
     * data-theme="dark"：
     * DaisyUI 的主题配置，
     * 表示默认使用 dark 深色主题。
     */
    <html lang="en">
      {/**
       * body 页面主体
       *
       * `${geistSans.variable} ${geistMono.variable}`：
       * 注入前面定义的字体 CSS 变量。
       *
       * antialiased：
       * Tailwind 类，用于让字体渲染更平滑。
       *
       * min-h-screen：
       * 页面最小高度为整个屏幕高度。
       *
       * flex flex-col：
       * 使用纵向 Flex 布局，
       * 方便实现 Header 顶部、Footer 底部、中间内容自适应撑开。
       */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/**
         * Providers
         *
         * 用于包裹全局上下文。
         *
         * 例如：
         * AuthProvider 登录状态
         * ThemeProvider 主题状态
         * React Query Provider
         * 其他全局状态管理 Provider
         *
         * 放在这里后，整个应用的所有页面和组件都可以访问这些全局能力。
         */}
        <Providers>
          {/**
           * Header
           *
           * 全站顶部导航栏。
           * 会出现在所有页面上。
           */}
          <Header />

          {/**
           * main 主内容区域
           *
           * flex-1：
           * 占据 Header 和 Footer 之外的剩余空间，
           * 让 Footer 在页面内容较少时也能保持在底部。
           *
           * children：
           * 当前具体页面内容会渲染到这里。
           */}
          <main className="flex-1">{children}</main>

          {/**
           * Footer
           *
           * 全站底部区域。
           * 会出现在所有页面上。
           */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}