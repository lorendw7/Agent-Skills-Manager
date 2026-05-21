import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/**
 * 获取当前登录用户创建的 Skill 列表
 *
 * 这是一个 Next.js Route Handler：
 * - 对应 GET /api/skills
 * - 用于 Dashboard 页面获取当前用户自己的 skills
 * - 通过 httpOnly Cookie 中的 auth_token 判断用户身份
 */
export async function GET(request: NextRequest) {
  try {
    /**
     * 从 httpOnly Cookie 中读取 auth_token
     *
     * 注意：
     * - httpOnly Cookie 不能被前端 JavaScript 直接读取
     * - 但在服务端 Route Handler 中可以通过 request.cookies 读取
     * - 这样可以降低 token 被 XSS 窃取的风险
     */
    const token = request.cookies.get("auth_token")?.value;

    /**
     * 如果没有 token，说明用户未登录
     * 返回 401 Unauthorized
     */
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /**
     * 验证 token 是否有效
     *
     * verifyToken 通常会：
     * - 校验 JWT 签名是否正确
     * - 检查 token 是否过期
     * - 解析出用户信息，例如 userId、email、name
     */
    const payload = verifyToken(token);

    /**
     * 如果 token 无效或已过期，也返回 401
     */
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /**
     * 查询当前登录用户创建的 skills
     *
     * where:
     * - 只查询 authorId 等于当前用户 id 的数据
     *
     * orderBy:
     * - 按创建时间倒序排列
     * - 最新创建的 skill 会显示在最前面
     *
     * select:
     * - 只返回前端列表页需要的字段
     * - 不返回 content，避免列表接口返回过大的正文内容
     */
    const skills = await prisma.skill.findMany({
      where: { authorId: payload.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        createdAt: true,
      },
    });

    /**
     * 查询成功，返回 skills 列表
     *
     * 返回格式：
     * {
     *   skills: [...]
     * }
     */
    return NextResponse.json({ skills });
  } catch (error) {
    /**
     * 捕获服务器内部错误
     *
     * 例如：
     * - 数据库连接失败
     * - Prisma 查询异常
     * - 其他未知错误
     */
    console.error("Get skills error:", error);

    /**
     * 返回 500 Internal Server Error
     *
     * 不建议把具体错误详情直接返回给前端，
     * 避免暴露服务器内部信息。
     */
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}