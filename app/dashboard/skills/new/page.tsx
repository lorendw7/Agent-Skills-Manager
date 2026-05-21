"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createSkill } from "@/actions/skills";

/**
 * 创建新 Skill 页面
 *
 * 这是一个 Client Component：
 * - 使用 useState 管理表单状态
 * - 使用 useRouter 做前端页面跳转
 * - 使用 useAuth 获取当前登录用户信息
 * - 调用 createSkill Server Action 创建数据
 */
export default function NewSkillPage() {
  // Next.js App Router 提供的路由对象，用于跳转页面
  const router = useRouter();

  // 获取当前用户、登录状态和认证加载状态
  const { user, isAuthenticated, isLoading } = useAuth();

  // Skill 名称
  const [name, setName] = useState("");

  // Skill 简短描述
  const [description, setDescription] = useState("");

  // Skill 的正文内容，使用 Markdown 格式
  // 默认提供一个带 frontmatter 的 Markdown 模板，方便用户直接编辑
  const [content, setContent] = useState(
    "---\nname: my-skill\ndescription: What this skill does\n---\n\n# Skill Title\n\nInstructions for how to use this skill...\n"
  );

  // 控制这个 Skill 是否公开
  const [isPublic, setIsPublic] = useState(true);

  // 保存表单错误信息
  const [error, setError] = useState("");

  // 控制提交按钮的 loading 状态，防止重复提交
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 如果认证状态已经加载完成，但用户未登录：
   * - 跳转到登录页
   * - 返回 null，避免当前页面内容短暂显示
   */
  if (!isLoading && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  /**
   * 表单提交处理函数
   *
   * @param e React 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // 阻止浏览器默认提交行为，避免页面刷新
    e.preventDefault();

    // 清空之前的错误信息
    setError("");

    /**
     * 前端基础校验：
     * - name 不能为空
     * - description 不能为空
     * - content 不能为空
     *
     * trim() 用来去掉首尾空格，避免用户只输入空格也通过校验。
     */
    if (!name.trim() || !description.trim() || !content.trim()) {
      setError("All fields are required");
      return;
    }

    // 开始提交，按钮进入 loading 状态
    setIsSubmitting(true);

    try {
      /**
       * 调用 Server Action 创建 Skill
       *
       * 注意：
       * - createSkill 在服务端执行
       * - 这里把表单数据和当前用户 id 传给服务端
       * - user!.id 中的 ! 表示告诉 TypeScript：这里 user 一定存在
       */
      const result = await createSkill(
        {
          name: name.trim(),
          description: description.trim(),
          content: content.trim(),
          isPublic,
        },
        user!.id
      );

      if (result.success) {
        // 创建成功后跳转回 Dashboard 页面
        router.push("/dashboard");
      } else {
        // 创建失败时，显示服务端返回的错误信息
        setError(result.error || "Failed to create skill");
      }
    } catch (err) {
      // 捕获网络错误或其他未知异常
      setError("An error occurred while creating the skill");
    } finally {
      // 无论成功或失败，都结束提交状态
      setIsSubmitting(false);
    }
  };

  /**
   * 如果认证状态还在加载中，显示 loading spinner
   */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* 返回 Dashboard 的按钮 */}
      <div className="mb-6">
        <Link href="/dashboard" className="btn btn-ghost btn-sm gap-2">
          ← Back to Dashboard
        </Link>
      </div>

      {/* 创建 Skill 的表单卡片 */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          {/* 页面标题 */}
          <h1 className="card-title text-2xl">Create New Skill</h1>

          {/* 页面说明文字 */}
          <p className="text-base-content/70">
            Define your agent skill using markdown format
          </p>

          {/* 表单区域 */}
          <form onSubmit={handleSubmit} className="mt-4">
            {/* 如果存在错误信息，则显示错误提示 */}
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            {/* Skill 名称输入框 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Skill Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g., web-design-guidelines"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            {/* Skill 描述输入框 */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                placeholder="Brief description of what this skill does"
                className="input input-bordered w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                required
              />
            </div>

            {/* Skill Markdown 内容输入框 */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Skill Content (Markdown)</span>
              </label>
              <textarea
                placeholder="Enter your skill here"
                className="textarea textarea-bordered w-full h-64 font-mono text-sm skill-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* 是否公开的开关 */}
            <div className="form-control mt-4">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span className="label-text">Make this skill public</span>
              </label>

              {/* 对公开状态的说明 */}
              <p className="text-sm text-base-content/60 ml-14">
                Public skills appear in the gallery and can be viewed by anyone
              </p>
            </div>

            {/* 表单底部操作按钮 */}
            <div className="card-actions justify-end mt-6">
              {/* 取消创建，返回 Dashboard */}
              <Link href="/dashboard" className="btn btn-ghost">
                Cancel
              </Link>

              {/* 提交按钮 */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    {/* 提交中显示 loading 图标 */}
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create Skill"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}