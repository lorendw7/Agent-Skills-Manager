// 导入 Next.js 导航工具类 404 页面方法
import { notFound } from "next/navigation";
// 导入 Next.js 客户端路由链接组件
import Link from "next/link";
// 导入 Prisma 数据库客户端实例
import { prisma } from "@/lib/prisma";

/**
 * 技能详情页面 - 动态路由 + 增量静态重生成(ISR)
 * 使用 [id] 动态路由片段，每 60 秒重新验证一次页面缓存
 */
// 开启 ISR 增量静态再生，页面缓存有效期 60 秒
export const revalidate = 60;

// 页面组件参数类型定义
interface PageProps {
  params: Promise<{ id: string }>; // 路由参数（异步 Promise 类型）
}

// 生成页面元数据（SEO 标题、描述）
export async function generateMetadata({ params }: PageProps) {
  // 解析异步路由参数
  const { id } = await params;
  // 根据技能 ID 查询数据库，只获取名称和描述
  const skill = await prisma.skill.findUnique({
    where: { id: parseInt(id) },
    select: { name: true, description: true },
  });

  // 技能不存在时，返回 404 标题
  if (!skill) {
    return { title: "Skill Not Found" };
  }

  // 返回正常的页面标题和描述
  return {
    title: `${skill.name} | Agent Skills Manager`,
    description: skill.description,
  };
}

// 根据 ID 获取单个技能详情（私有方法）
async function getSkill(id: string) {
  // 查询公开的技能，同时关联查询作者信息
  const skill = await prisma.skill.findUnique({
    where: { id: parseInt(id), isPublic: true },
    include: {
      author: {
        select: { name: true }, // 只查询作者名称
      },
    },
  });
  return skill;
}

// 技能详情页面默认导出组件
export default async function SkillDetailPage({ params }: PageProps) {
  // 获取路由中的技能 ID
  const { id } = await params;
  // 调用方法查询技能数据
  const skill = await getSkill(id);

  // 技能不存在，跳转到 404 页面
  if (!skill) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 返回技能列表按钮 */}
      <div className="mb-6">
        <Link href="/skills" className="btn btn-ghost btn-sm gap-2">
          ← Back to Skills
        </Link>
      </div>

      {/* 技能信息卡片 */}
      <article className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div>
              {/* 技能名称 */}
              <h1 className="text-3xl font-bold">{skill.name}</h1>
              {/* 技能描述 */}
              <p className="text-base-content/70 mt-2">{skill.description}</p>
            </div>
            {/* ISR 标识 */}
            <div className="badge badge-secondary">ISR</div>
          </div>

          {/* 分割线 */}
          <div className="divider"></div>

          {/* 作者、创建时间、更新时间 */}
          <div className="flex gap-4 text-sm text-base-content/60 mb-4">
            <span>By {skill.author.name}</span>
            <span>•</span>
            <span>Created {new Date(skill.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Updated {new Date(skill.updatedAt).toLocaleDateString()}</span>
          </div>

          {/* 技能内容展示区域 */}
          <div className="bg-base-300 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Skill Content</h2>
            {/* 技能内容原文展示 */}
            <pre className="skill-content whitespace-pre-wrap text-sm">
              {skill.content}
            </pre>
          </div>
        </div>
      </article>
    </div>
  );
}