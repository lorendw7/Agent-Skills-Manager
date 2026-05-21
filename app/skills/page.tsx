import Link from "next/link";
import { prisma } from "@/lib/prisma";

/**
 * Skills Gallery 页面
 *
 * 这是一个 Server Component：
 * - 默认在服务端执行
 * - 可以直接访问数据库
 * - 不需要使用 useState、useEffect 等客户端 Hook
 *
 * 当前页面使用 ISR（Incremental Static Regeneration，增量静态再生成）：
 * - 页面会被静态生成并缓存
 * - 每隔 60 秒允许重新生成一次
 * - 适合公开列表页、内容更新频率不高的页面
 */
export const revalidate = 60;

/**
 * 页面 metadata
 *
 * Next.js App Router 会根据这里的配置生成：
 * - 页面标题 title
 * - 页面描述 description
 *
 * 有利于 SEO 和浏览器标签页展示。
 */
export const metadata = {
  title: "Browse Skills | Agent Skills Manager",
  description: "Explore public AI agent skills created by the community",
};

/**
 * 获取所有公开的 Skills
 *
 * 该函数在服务端执行：
 * - 直接通过 Prisma 查询数据库
 * - 只查询 isPublic 为 true 的 Skill
 * - 同时查询作者名称
 */
async function getPublicSkills() {
  const skills = await prisma.skill.findMany({
    /**
     * 查询条件：
     * 只获取公开的 Skill
     */
    where: { isPublic: true },

    /**
     * include 用于关联查询
     *
     * 这里查询 Skill 对应的 author 用户信息，
     * 但只选择 author.name，避免返回不必要的用户字段。
     */
    include: {
      author: {
        select: { name: true },
      },
    },

    /**
     * 按创建时间倒序排列
     *
     * 最新创建的公开 Skill 会显示在最前面。
     */
    orderBy: { createdAt: "desc" },
  });

  return skills;
}

/**
 * 公开 Skills 展示页
 *
 * 这是一个 async Server Component：
 * - 可以在组件内部直接 await 数据库查询函数
 * - 页面渲染前会先拿到 public skills 数据
 */
export default async function SkillsPage() {
  // 获取所有公开 Skills
  const skills = await getPublicSkills();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面顶部区域：标题、说明、ISR 标识 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* 页面主标题 */}
          <h1 className="text-3xl font-bold">Public Skills Gallery</h1>

          {/* 页面说明文字，提示该页面使用 ISR */}
          <p className="text-base-content/70 mt-2">
            This page uses ISR - revalidates every 60 seconds
          </p>
        </div>

        {/* ISR 缓存刷新时间标识 */}
        <div className="badge badge-secondary badge-lg">ISR: 60s</div>
      </div>

      {/* 如果没有公开 Skill，显示空状态 */}
      {skills.length === 0 ? (
        <div className="text-center py-16">
          {/* 空状态图标 */}
          <div className="text-6xl mb-4">📭</div>

          {/* 空状态标题 */}
          <h2 className="text-xl font-semibold mb-2">No skills yet</h2>

          {/* 空状态说明 */}
          <p className="text-base-content/70 mb-4">
            Be the first to create a skill!
          </p>

          {/* 引导用户注册 */}
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      ) : (
        /**
         * 如果存在公开 Skill，则以卡片网格形式展示
         *
         * 响应式布局：
         * - 默认单列
         * - md 屏幕：2 列
         * - lg 屏幕：3 列
         */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            /**
             * 每个 Skill 卡片本身就是一个 Link
             *
             * 点击卡片后跳转到 Skill 详情页：
             * /skills/[id]
             */
            <Link
              key={skill.id}
              href={`/skills/${skill.id}`}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                {/* Skill 名称 */}
                <h2 className="card-title">{skill.name}</h2>

                {/* Skill 描述，最多显示两行 */}
                <p className="text-base-content/70 line-clamp-2">
                  {skill.description}
                </p>

                {/* 卡片底部：作者名称 + 创建日期 */}
                <div className="card-actions justify-between items-center mt-4">
                  {/* 作者名称 */}
                  <span className="text-sm text-base-content/60">
                    by {skill.author.name}
                  </span>

                  {/* 创建日期 */}
                  <span className="text-xs text-base-content/50">
                    {new Date(skill.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}