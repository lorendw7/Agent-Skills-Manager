"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

/**
 * RegisterPage
 *
 * 注册页面组件。
 *
 * Register Page - CSR（Client-Side Rendering）
 *
 * 这是一个客户端渲染页面。
 * 主要通过 React 的 useState 在浏览器端管理表单状态，
 * 并调用 useAuth 中的 register 方法完成用户注册。
 *
 * 主要功能：
 * 1. 管理注册表单输入状态
 * 2. 校验两次输入的密码是否一致
 * 3. 校验密码长度是否符合要求
 * 4. 调用注册接口创建账号
 * 5. 注册成功后跳转到 dashboard 页面
 * 6. 如果用户已经登录，则自动跳转到 dashboard
 */
export default function RegisterPage() {
  /**
   * Next.js 路由对象
   *
   * 用于在注册成功后跳转页面。
   */
  const router = useRouter();

  /**
   * 从全局认证上下文中获取注册方法和认证状态
   *
   * register：注册方法
   * isAuthenticated：当前用户是否已经登录
   * isLoading：是否正在检查登录状态
   */
  const { register, isAuthenticated, isLoading } = useAuth();

  /**
   * 注册表单状态
   *
   * name：用户姓名
   * email：用户邮箱
   * password：用户密码
   * confirmPassword：确认密码
   * error：错误提示信息
   * isSubmitting：是否正在提交表单
   */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 如果用户已经登录，则直接跳转到 dashboard 页面
   *
   * !isLoading：
   * 表示登录状态检查已经完成。
   *
   * isAuthenticated：
   * 表示当前用户已经处于登录状态。
   *
   * return null：
   * 阻止注册页面继续渲染，避免页面闪烁。
   */
  if (!isLoading && isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  /**
   * 注册表单提交处理函数
   *
   * 执行流程：
   * 1. 阻止表单默认提交行为，避免页面刷新
   * 2. 清空之前的错误信息
   * 3. 校验两次密码是否一致
   * 4. 校验密码长度是否至少为 6 位
   * 5. 调用 register 方法提交注册信息
   * 6. 注册成功后跳转到 dashboard
   * 7. 注册失败时显示错误信息
   * 8. 最后恢复提交状态
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // 阻止浏览器默认表单提交行为
    e.preventDefault();

    // 每次重新提交前，先清空旧的错误提示
    setError("");

    // 前端校验：两次输入的密码必须一致
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // 前端校验：密码长度至少 6 位
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // 开始提交，禁用按钮并显示 loading
    setIsSubmitting(true);

    try {
      // 调用全局注册方法，将表单数据提交给后端
      await register({ email, password, name });

      // 注册成功后跳转到用户后台页面
      router.push("/dashboard");
    } catch (err) {
      // 注册失败时，优先显示具体错误信息
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      // 无论注册成功还是失败，都结束提交状态
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
       * 标题居中显示。
       */}
      <h2 className="card-title text-2xl justify-center">Create Account</h2>

      {/**
       * 页面说明文字
       *
       * text-base-content/70：
       * 使用主题文本色，并降低透明度，
       * 让说明文字视觉层级低于标题。
       */}
      <p className="text-center text-base-content/70">
        Join to create and share agent skills
      </p>

      {/**
       * 注册表单
       *
       * onSubmit：
       * 表单提交时执行 handleSubmit。
       *
       * mt-4：
       * 设置顶部外边距。
       */}
      <form onSubmit={handleSubmit} className="mt-4">
        {/**
         * 错误提示区域
         *
         * 只有 error 有内容时才会显示。
         * 用于展示密码不一致、密码过短、注册失败等错误信息。
         */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {/**
         * 姓名输入区域
         */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>

          <input
            type="text"
            placeholder="Your name"
            className="input input-bordered w-full"

            // 将输入框内容绑定到 name 状态
            value={name}

            // 用户输入时更新 name 状态
            onChange={(e) => setName(e.target.value)}

            // HTML 原生必填校验
            required
          />
        </div>

        {/**
         * 邮箱输入区域
         */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"

            // 将输入框内容绑定到 email 状态
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

            // 将输入框内容绑定到 password 状态
            value={password}

            // 用户输入时更新 password 状态
            onChange={(e) => setPassword(e.target.value)}

            // HTML 原生必填校验
            required

            // HTML 原生最小长度校验
            minLength={6}
          />
        </div>

        {/**
         * 确认密码输入区域
         *
         * 用于让用户再次输入密码，
         * 前端会在提交时判断两次密码是否一致。
         */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full"

            // 将输入框内容绑定到 confirmPassword 状态
            value={confirmPassword}

            // 用户输入时更新 confirmPassword 状态
            onChange={(e) => setConfirmPassword(e.target.value)}

            // HTML 原生必填校验
            required
          />
        </div>

        {/**
         * 注册按钮区域
         */}
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-primary w-full"

            // 表单提交中禁用按钮，防止重复点击
            disabled={isSubmitting}
          >
            {/**
             * 如果正在提交，显示 loading 图标；
             * 否则显示按钮文字 Create Account。
             */}
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>

      {/**
       * 分割线
       *
       * 用于分隔注册表单和登录入口。
       */}
      <div className="divider">OR</div>

      {/**
       * 登录入口
       *
       * 如果用户已经有账号，可以点击跳转到登录页面。
       */}
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="link link-primary">
          Sign in
        </Link>
      </p>
    </>
  );
}