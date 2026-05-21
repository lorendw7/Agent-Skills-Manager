import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";



// 处理用户注册请求
export async function POST(request: NextRequest) {
  try {
    // 解析请求体中的 JSON 数据
    const body = await request.json();

    // 从请求体中取出邮箱、密码和用户名
    const { email, password, name } = body;

    // 校验必填字段
    // 如果 email、password 或 name 任意一个为空，则返回 400 错误
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // 检查该邮箱是否已经注册过
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // 如果用户已存在，则返回 409 冲突错误
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // 对用户密码进行哈希加密，避免明文密码直接存入数据库
    const hashedPassword = await hashPassword(password);

    // 在数据库中创建新用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // 生成登录认证 token
    // token 中保存用户的基础信息，用于后续身份验证
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // 创建注册成功的响应
    // 注意：这里返回给前端的 user 信息不包含 password
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );

    // 将 token 写入 httpOnly Cookie
    // httpOnly Cookie 不能被前端 JavaScript 直接读取，安全性更高
    setAuthCookie(response, token);

    // 返回最终响应
    return response;
  } catch (error) {
    // 捕获注册过程中的异常，并打印到服务端日志
    console.error("Registration error:", error);

    // 返回 500 服务器内部错误
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}