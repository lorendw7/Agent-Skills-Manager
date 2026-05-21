// 从 Next.js 中导入请求和响应对象类型
import { NextRequest, NextResponse } from "next/server";

// 导入 Prisma 客户端，用于操作数据库
import { prisma } from "@/lib/prisma";

// 导入 token 校验方法，用于验证用户登录状态
import { verifyToken } from "@/lib/auth";

// 定义路由参数类型
// 在 Next.js App Router 中，动态路由参数 params 是一个 Promise
interface RouteParams {
  params: Promise<{ id: string }>;
}

// 定义 GET 请求处理函数
// 用于根据 skill 的 id 获取某个技能详情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 从动态路由参数中取出 id
    const { id } = await params;

    // 将字符串类型的 id 转换为数字类型
    const skillId = parseInt(id);

    // 如果 id 不是合法数字，则返回 400 错误
    if (isNaN(skillId)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
    }

    // 从 httpOnly cookie 中获取认证 token
    // httpOnly cookie 无法被前端 JavaScript 直接读取，更安全
    const token = request.cookies.get("auth_token")?.value;

    // 如果没有 token，说明用户未登录，返回 401 未授权
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 校验 token，并解析出用户信息
    const payload = verifyToken(token);

    // 如果 token 无效或已过期，返回 401 未授权
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 根据 skillId 查询数据库中的技能记录
    const skill = await prisma.skill.findUnique({
      // 查询条件：技能 id
      where: { id: skillId },

      // 只选择需要返回的字段，避免暴露多余数据
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        isPublic: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 如果没有找到对应技能，返回 404
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // 检查当前登录用户是否是该技能的作者
    // 只有作者本人可以编辑该技能
    if (skill.authorId !== payload.userId) {
      return NextResponse.json(
        { error: "Not authorized to edit this skill" },
        { status: 403 }
      );
    }

    // 校验通过后，返回技能详情
    return NextResponse.json({ skill });
  } catch (error) {
    // 捕获并打印服务端错误，方便调试
    console.error("Get skill error:", error);

    // 返回 500 服务器内部错误
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}