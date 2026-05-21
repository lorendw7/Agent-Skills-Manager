"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { updateSkill } from "@/actions/skills";

// 页面组件接收的 props 类型
// 在这个项目中，params 被定义为 Promise，需要在 useEffect 中异步解析
interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 编辑 Skill 页面
 *
 * 这是一个 Client Component：
 * - 使用 useState 管理表单状态
 * - 使用 useEffect 处理副作用，例如解析路由参数、鉴权、请求数据
 * - 使用 useRouter 做页面跳转
 * - 通过动态路由中的 id 获取要编辑的 Skill
 */
export default function EditSkillPage({ params }: PageProps) {
  // Next.js App Router 提供的路由对象，用于页面跳转
  const router = useRouter();

  // 获取当前登录用户、认证状态和认证加载状态
  const { user, isAuthenticated, isLoading } = useAuth();

  // 当前正在编辑的 skill id
  const [skillId, setSkillId] = useState<number | null>(null);

  // 表单字段：Skill 名称
  const [name, setName] = useState("");

  // 表单字段：Skill 描述
  const [description, setDescription] = useState("");

  // 表单字段：Skill 正文内容，通常是 Markdown
  const [content, setContent] = useState("");

  // 表单字段：是否公开
  const [isPublic, setIsPublic] = useState(true);

  // 保存错误信息，用于页面提示
  const [error, setError] = useState("");

  // 表单是否正在提交，用于禁用按钮和显示 loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当前 Skill 数据是否正在加载
  const [loadingSkill, setLoadingSkill] = useState(true);

  /**
   * 获取动态路由参数 id
   *
   * 例如页面路径是：
   * /dashboard/skills/123/edit
   *
   * 那么 params 中的 id 就是 "123"。
   * parseInt 会把字符串 id 转换成数字类型。
   */
  useEffect(() => {
    params.then((p) => setSkillId(parseInt(p.id)));
  }, [params]);

  /**
   * 登录状态检查
   *
   * 当认证加载完成后：
   * - 如果用户未登录，跳转到登录页
   * - 如果用户已登录，则继续留在编辑页
   */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  /**
   * 获取当前 Skill 的数据
   *
   * 只有当：
   * - skillId 已经解析出来
   * - user 已经存在
   *
   * 才请求后端接口。
   */
  useEffect(() => {
    if (skillId && user) {
      fetchSkill();
    }
  }, [skillId, user]);

  /**
   * 根据 skillId 请求 Skill 详情
   *
   * 请求成功后，将后端返回的数据填充到表单中，
   * 这样用户可以在原有内容基础上编辑。
   */
  const fetchSkill = async () => {
    try {
      // 如果还没有拿到 skillId，直接返回
      if (!skillId) return;

      /**
       * 请求当前 Skill 的详情
       *
       * credentials: "include" 表示请求时携带 Cookie。
       * 如果项目使用 httpOnly Cookie 做登录态，
       * 后端可以通过 Cookie 判断当前用户是谁。
       */
      const response = await fetch(`/api/skills/${skillId}`, {
        credentials: "include",
      });

      if (response.ok) {
        // 请求成功，解析返回数据
        const data = await response.json();

        if (data.skill) {
          // 把后端返回的 Skill 数据填入表单
          setName(data.skill.name);
          setDescription(data.skill.description);
          setContent(data.skill.content);
          setIsPublic(data.skill.isPublic);
        }
      } else if (response.status === 404) {
        // 404 表示这个 Skill 不存在
        setError("Skill not found");
      } else if (response.status === 403) {
        // 403 表示当前用户没有权限编辑这个 Skill
        setError("You don't have permission to edit this skill");
      }
    } catch (err) {
      // 捕获网络错误或其他未知异常
      setError("Failed to load skill");
    } finally {
      // 无论成功或失败，都结束 Skill 加载状态
      setLoadingSkill(false);
    }
  };

  /**
   * 表单提交处理函数
   *
   * @param e React 表单提交事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // 阻止浏览器默认提交行为，避免页面刷新
    e.preventDefault();

    // 清空之前的错误提示
    setError("");

    /**
     * 前端基础校验：
     * - name 不能为空
     * - description 不能为空
     * - content 不能为空
     *
     * trim() 用于去掉首尾空格，避免用户只输入空格也通过校验。
     */
    if (!name.trim() || !description.trim() || !content.trim()) {
      setError("All fields are required");
      return;
    }

    // 如果缺少 skillId 或 user，说明当前状态不完整，直接返回
    if (!skillId || !user) return;

    // 开始提交，按钮进入 loading 状态
    setIsSubmitting(true);

    try {
      /**
       * 调用 Server Action 更新 Skill
       *
       * updateSkill 参数：
       * 1. skillId：要更新的 Skill id
       * 2. 表单数据：更新后的 name / description / content / isPublic
       * 3. user.id：当前用户 id，用于服务端权限校验
       */
      const result = await updateSkill(
        skillId,
        {
          name: name.trim(),
          description: description.trim(),
          content: content.trim(),
          isPublic,
        },
        user.id
      );

      if (result.success) {
        // 更新成功后，跳转回 Dashboard
        router.push("/dashboard");
      } else {
        // 更新失败时，显示服务端返回的错误信息
        setError(result.error || "Failed to update skill");
      }
    } catch (err) {
      // 捕获未知异常
      setError("An error occurred while updating the skill");
    } finally {
      // 无论成功或失败，都结束提交状态
      setIsSubmitting(false);
    }
  };

  /**
   * 如果认证状态或 Skill 数据还在加载中，
   * 显示 loading spinner。
   */
  if (isLoading || loadingSkill) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  /**
   * 如果加载 Skill 时发生错误，并且 name 为空，
   * 通常说明 Skill 没有成功加载。
   *
   * 例如：
   * - Skill 不存在
   * - 当前用户没有权限
   * - 请求失败
   */
  if (error && !name) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>

        {/* 返回 Dashboard */}
        <Link href="/dashboard" className="btn btn-ghost mt-4">
          ← Back to Dashboard
        </Link>
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

      {/* 编辑 Skill 的表单卡片 */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          {/* 页面标题 */}
          <h1 className="card-title text-2xl">Edit Skill</h1>

          {/* 页面说明 */}
          <p className="text-base-content/70">
            Update your agent skill content
          </p>

          {/* 编辑表单 */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* 如果存在错误信息，则显示错误提示 */}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Skill 名称输入框 */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Skill Name</span>
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Description</span>
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">
                  Skill Content (Markdown)
                </span>
              </label>
              <textarea
                placeholder="Enter your skill content in markdown format..."
                className="textarea textarea-bordered w-full h-64 font-mono text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* 是否公开的开关 */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span className="label-text">Make this skill public</span>
              </label>

              {/* 公开状态说明 */}
              <p className="text-sm text-base-content/60 ml-14">
                Public skills appear in the gallery and can be viewed by anyone
              </p>
            </div>

            {/* 底部操作按钮 */}
            <div className="flex justify-end gap-3 pt-4">
              {/* 取消编辑，返回 Dashboard */}
              <Link href="/dashboard" className="btn btn-ghost">
                Cancel
              </Link>

              {/* 保存修改按钮 */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    {/* 提交中显示 loading 图标 */}
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}