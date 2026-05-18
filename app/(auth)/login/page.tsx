"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

/**
 * LoginPage
 *
 * 登录页面组件。
 *
 * 这是一个客户端组件，使用 CSR（Client-Side Rendering）方式渲染。
 *
 * 主要功能：
 * 1. 管理登录表单状态
 * 2. 调用 useAuth 中的 login 方法完成登录
 * 3. 登录成功后跳转到 dashboard 页面
 * 4. 如果用户已经登录，则自动跳转到 dashboard
 */
export default function LoginPage() {
  /**
   * Next.js 路由对象
   *
   * 用于在登录成功后进行页面跳转。
   */
  const router = useRouter();

  /**
   * 从全局认证上下文中获取认证相关状态和方法
   *
   * login：登录方法
   * isAuthenticated：当前用户是否已经登录
   * isLoading：是否正在检查登录状态
   */
  const { login, isAuthenticated, isLoading } = useAuth();

  /**
   * 登录表单状态
   *
   * email：用户输入的邮箱
   * password：用户输入的密码
   * error：登录失败时显示的错误信息
   * isSubmitting：表单是否正在提交，用于禁用按钮和显示 loading
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 如果当前用户已经登录，则直接跳转到 dashboard 页面
   *
   * !isLoading：
   * 表示已经完成登录状态检查。
   *
   * isAuthenticated：
   * 表示当前用户已经登录。
   *
   * return null：
   * 防止登录页面继续渲染，避免页面闪烁。
   */
  if (!isLoading && isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  /**
   * 登录表单提交处理函数
   *
   * 执行流程：
   * 1. 阻止表单默认刷新页面行为
   * 2. 清空之前的错误信息
   * 3. 设置提交状态为 true
   * 4. 调用 login 方法提交邮箱和密码
   * 5. 登录成功后跳转到 dashboard
   * 6. 登录失败时显示错误信息
   * 7. 最后恢复提交状态
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 调用全局认证方法进行登录
      await login({ email, password });

      // 登录成功后跳转到用户后台页面
      router.push("/dashboard");
    } catch (err) {
      // 如果登录失败，显示错误信息
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      // 无论成功还是失败，都结束提交状态
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/**
       * 页面标题
       *
       * card-title：
       * DaisyUI 的卡片标题样式。
       *
       * text-2xl：
       * 设置标题字号。
       *
       * justify-center：
       * 让标题居中显示。
       */}
      <h2 className="card-title text-2xl justify-center">Welcome Back</h2>

      {/**
       * 页面副标题
       *
       * text-base-content/70：
       * 使用主题文本颜色，并降低透明度，
       * 让说明文字视觉上弱于标题。
       */}
      <p className="text-center text-base-content/70">
        Sign in to manage your agent skills
      </p>

      {/**
       * 登录表单
       *
       * onSubmit：
       * 表单提交时调用 handleSubmit。
       *
       * mt-4：
       * 给表单顶部增加间距。
       */}
      <form onSubmit={handleSubmit} className="mt-4">
        {/**
         * 错误提示区域
         *
         * 只有 error 有内容时才显示。
         * 通常用于展示邮箱密码错误、网络错误等登录失败信息。
         */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {/**
         * 邮箱输入区域
         */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"

            // 输入框内容绑定到 email 状态
            value={email}

            // 用户输入时更新 email 状态
            onChange={(e) => setEmail(e.target.value)}

            // HTML 原生必填校验
            required
          />
        </div>

        {/**
         * 密码输入区域
         */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full"

            // 输入框内容绑定到 password 状态
            value={password}

            // 用户输入时更新 password 状态
            onChange={(e) => setPassword(e.target.value)}

            // HTML 原生必填校验
            required
          />
        </div>

        {/**
         * 登录按钮区域
         */}
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-primary w-full"

            // 表单提交中禁用按钮，防止重复点击提交
            disabled={isSubmitting}
          >
            {/**
             * 如果正在提交，显示 loading 图标；
             * 否则显示按钮文字 Sign In。
             */}
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      {/**
       * 分割线
       *
       * 用于分隔登录表单和注册链接。
       */}
      <div className="divider">OR</div>

      {/**
       * 注册入口
       *
       * 如果用户没有账号，可以点击跳转到注册页面。
       */}
      <p className="text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="link link-primary">
          Sign up
        </Link>
      </p>
    </>
  );
}