"use client";

import { AuthProvider } from "@/hooks/useAuth";

/**
 * Providers
 *
 * 全局 Provider 组件。
 *
 * 作用：
 * 1. 集中管理应用需要的全局上下文
 * 2. 避免在 app/layout.tsx 中堆叠多个 Provider
 * 3. 让整个应用都可以访问登录状态等全局能力
 *
 * 注意：
 * 因为 AuthProvider 内部使用了 React Context、useState、useEffect 等客户端能力，
 * 所以这个组件需要声明为客户端组件。
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    /**
     * AuthProvider
     *
     * 认证状态 Provider。
     *
     * 包裹 children 后，应用内部的所有子组件
     * 都可以通过 useAuth() 获取：
     *
     * - 当前用户信息 user
     * - 是否已登录 isAuthenticated
     * - 是否正在检查登录状态 isLoading
     * - 登录方法 login
     * - 注册方法 register
     * - 退出方法 logout
     * - 检查登录状态方法 checkAuth
     */
    <AuthProvider>{children}</AuthProvider>
  );
}