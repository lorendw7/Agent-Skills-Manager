import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

// 处理用户退出登录请求
export async function POST() {
  // 创建退出登录成功的 JSON 响应
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  // 清除认证 Cookie
  // 通常会删除 auth_token，让浏览器不再携带登录凭证
  clearAuthCookie(response);

  // 返回响应给前端
  return response;
}