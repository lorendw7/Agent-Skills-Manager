import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * 从 httpOnly Cookie 中获取当前已登录用户信息
 */
export async function GET(request: NextRequest) {
  // 从请求 Cookie 中读取 auth_token
  // auth_token 通常是在用户登录或注册成功后写入的认证凭证
  const token = request.cookies.get("auth_token")?.value;

  // 如果 Cookie 中不存在 token，说明用户未登录或登录状态已失效
  // 返回 user: null，并使用 401 表示未认证
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // 校验 token 是否合法，并解析出其中保存的用户信息
  const payload = verifyToken(token);

  // 如果 token 无效、过期或解析失败，同样返回未认证状态
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // token 校验通过后，返回当前登录用户的基础信息
  // 注意：这里只返回 id、email、name，不返回敏感信息
  return NextResponse.json({
    user: {
      // 用户 ID
      id: payload.userId,

      // 用户邮箱
      email: payload.email,

      // 用户名称
      name: payload.name,
    },
  });
}