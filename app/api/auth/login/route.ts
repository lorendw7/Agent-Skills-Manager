// app/api/auth/login/route.ts
// Next.js 13+ 的服务端 API 路由文件，路径对应 /api/auth/login
import { NextRequest, NextResponse } from "next/server";

// 导出 POST 请求处理函数（Next.js 约定：函数名必须和请求方法一致，如 GET/POST/PUT/DELETE）
export async function POST(request: NextRequest) {
  // 1. 从请求体中解析 JSON 数据，解构出 email 和 password
  // request.json() 是异步方法，必须加 await 才能拿到结果
  const { email, password } = await request.json();

  // 2. 校验账号密码是否为预设的 "admin"
  // 条件：email 不等于 "admin" 或者 password 不等于 "admin" 时，进入错误分支
  if (email !== "admin" || password !== "admin") {
    // 校验失败：返回 JSON 格式的错误信息，同时设置 HTTP 状态码为 401（未授权）
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // 3. 校验成功：构造登录成功的响应数据
  const response = NextResponse.json({
    message: "Login successful", // 成功提示信息
    user: { id: "1", name: "admin" }, // 返回的用户信息（示例数据）
  });

  // 4. 返回构造好的响应对象给客户端
  return response;
}