"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { deleteSkill } from "@/actions/skills";

// 定义 Skill 技能对象的数据结构
interface Skill {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
}

/**
 * Dashboard 页面
 *
 * 这是一个 Client Component，因为它使用了：
 * 1. useState / useEffect 等 React Hooks
 * 2. useRouter 做前端跳转
 * 3. useAuth 获取当前登录用户状态
 *
 * 当前登录方式基于 httpOnly Cookie：
 * - Cookie 会由浏览器自动携带
 * - 前端 JavaScript 无法直接读取 httpOnly Cookie
 * - 因此安全性比把 token 存在 localStorage 更高
 */
export default function DashboardPage() {
  // Next.js App Router 提供的前端路由对象，用于页面跳转
  const router = useRouter();

  // 从自定义 useAuth Hook 中获取当前用户、登录状态和加载状态
  const { user, isAuthenticated, isLoading } = useAuth();

  // 保存当前用户创建的 skills 列表
  const [skills, setSkills] = useState<Skill[]>([]);

  // 控制 skills 是否正在加载
  const [loadingSkills, setLoadingSkills] = useState(true);

  // 保存当前正在删除的 skill id，用于禁用按钮和显示 loading
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /**
   * 检查用户是否已登录
   *
   * 当认证状态加载完成后：
   * - 如果用户没有登录，则跳转到登录页
   * - 如果用户已登录，则留在 Dashboard 页面
   */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  /**
   * 当 user 存在时，说明用户已经登录
   * 此时请求当前用户的 skills 数据
   */
  useEffect(() => {
    if (user) {
      fetchUserSkills();
    }
  }, [user]);

  /**
   * 请求当前用户创建的 skills
   *
   * credentials: "include" 的作用：
   * - 请求时自动携带 Cookie
   * - 后端可以通过 Cookie 中的 auth_token 判断当前用户是谁
   */
  const fetchUserSkills = async () => {
    try {
      const response = await fetch("/api/skills", {
        credentials: "include",
      });

      // 如果请求成功，解析返回的数据并更新 skills 状态
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills || []);
      }
    } catch (error) {
      // 请求失败时，在控制台打印错误
      console.error("Failed to fetch skills:", error);
    } finally {
      // 无论请求成功还是失败，都结束 loading 状态
      setLoadingSkills(false);
    }
  };

  /**
   * 删除指定的 skill
   *
   * @param id 要删除的 skill id
   */
  const handleDelete = async (id: number) => {
    // 如果用户不存在，或者用户取消确认弹窗，则直接返回
    if (!user || !confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    // 记录当前正在删除的 skill id
    setDeletingId(id);

    try {
      // 调用 Server Action 删除 skill
      const result = await deleteSkill(id, user.id);

      if (result.success) {
        // 删除成功后，从前端状态中移除该 skill
        setSkills(skills.filter((s) => s.id !== id));
      } else {
        // 删除失败时显示后端返回的错误信息
        alert(result.error || "Failed to delete skill");
      }
    } catch (error) {
      // 捕获异常并提示用户
      console.error("Delete error:", error);
      alert("Failed to delete skill");
    } finally {
      // 删除操作结束，清空正在删除的状态
      setDeletingId(null);
    }
  };

  /**
   * 用户认证状态正在加载时，显示 loading spinner
   */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  /**
   * 如果用户未登录：
   * - useEffect 会负责跳转到 /login
   * - 这里先返回 null，避免页面内容闪现
   */
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面顶部：标题、欢迎语、创建按钮 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/70 mt-1">
            Welcome back, {user?.name}!
          </p>
        </div>

        {/* 跳转到创建 Skill 页面 */}
        <Link href="/dashboard/skills/new" className="btn btn-primary">
          + Create Skill
        </Link>
      </div>

      {/* 统计区域：显示总数、公开数量、私有数量 */}
      <div className="stats shadow mb-8">
        <div className="stat">
          <div className="stat-title">Total Skills</div>
          <div className="stat-value">{skills.length}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Public</div>
          <div className="stat-value text-primary">
            {skills.filter((s) => s.isPublic).length}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Private</div>
          <div className="stat-value text-secondary">
            {skills.filter((s) => !s.isPublic).length}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Skills</h2>

      {/* skills 正在加载时，显示骨架屏 */}
      {loadingSkills ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-200">
              <div className="card-body">
                <div className="skeleton h-6 w-3/4"></div>
                <div className="skeleton h-4 w-full mt-2"></div>
                <div className="skeleton h-8 w-24 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        /**
         * 如果 skills 加载完成但列表为空，
         * 显示空状态，引导用户创建第一个 skill
         */
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No skills yet</h3>
          <p className="text-base-content/70 mb-4">
            Create your first agent skill to get started
          </p>

          <Link href="/dashboard/skills/new" className="btn btn-primary">
            Create Skill
          </Link>
        </div>
      ) : (
        /**
         * 如果 skills 存在，则以卡片形式展示每个 skill
         */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="card bg-base-200">
              <div className="card-body">
                {/* 卡片头部：skill 名称 + 公开/私有状态 */}
                <div className="flex justify-between items-start">
                  <h3 className="card-title text-lg">{skill.name}</h3>

                  {/* 根据 isPublic 显示不同样式的 badge */}
                  <div
                    className={`badge ${
                      skill.isPublic ? "badge-success" : "badge-ghost"
                    }`}
                  >
                    {skill.isPublic ? "Public" : "Private"}
                  </div>
                </div>

                {/* skill 描述，最多显示两行 */}
                <p className="text-base-content/70 text-sm line-clamp-2">
                  {skill.description}
                </p>

                {/* 卡片底部操作按钮：编辑和删除 */}
                <div className="card-actions justify-end mt-4">
                  {/* 跳转到编辑页面 */}
                  <Link
                    href={`/dashboard/skills/${skill.id}/edit`}
                    className="btn btn-ghost btn-sm"
                  >
                    Edit
                  </Link>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="btn btn-error btn-sm btn-outline"
                    disabled={deletingId === skill.id}
                  >
                    {/* 如果当前 skill 正在删除，显示 loading；否则显示 Delete 文案 */}
                    {deletingId === skill.id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}