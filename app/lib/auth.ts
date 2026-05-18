// 导入密码加密库 bcryptjs
import bcrypt from "bcryptjs";
// 导入 Next.js 服务端获取 Cookie 的方法
import { cookies } from "next/headers";
// 导入 Next.js 响应对象
import { NextResponse } from "next/server";

// 密码加密强度（数字越大越安全，计算也越慢）
const SALT_ROUNDS = 10;
// 从环境变量读取 Token 有效期（小时），默认 24 小时
const TOKEN_EXPIRY_HOURS = parseInt(process.env.AUTH_TOKEN_EXPIRY_HOURS || "24");
// 认证 Cookie 的名称
const AUTH_COOKIE_NAME = "auth_token";

/**
 * Token 载荷数据类型定义
 */
export interface TokenPayload {
  userId: number;    // 用户ID
  email: string;     // 用户邮箱
  name: string;      // 用户名
  exp: number;       // 过期时间戳（毫秒）
}

/**
 * 对密码进行加密（哈希）
 * @param password 明文密码
 * @returns 加密后的密码字符串
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 校验明文密码与哈希密码是否匹配
 * @param password 明文密码
 * @param hash 数据库中存储的加密密码
 * @returns 校验结果：true 匹配 / false 不匹配
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * 生成简单的 Base64 认证 Token（开发环境使用）
 * 生产环境建议使用正规 JWT 库
 * @param user 用户信息
 * @returns 加密后的 token 字符串
 */
export function generateToken(user: {
  id: number;
  email: string;
  name: string;
}): string {
  // 构造 Token 载荷
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    exp: Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000, // 设置过期时间
  };

  // 转 JSON 后再进行 Base64 编码
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/**
 * 验证并解析 Token
 * @param token 前端传来的 token
 * @returns 解析后的用户信息 / null（无效/过期）
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    // Base64 解码 → 转 JSON 对象
    const payload = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    ) as TokenPayload;

    // 检查 Token 是否过期
    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    // 解析失败（伪造/格式错误）返回 null
    return null;
  }
}

/**
 * 设置认证 Cookie（存入浏览器，安全配置）
 * @param response NextResponse 响应对象
 * @param token 生成的认证 token
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,    // 禁止 JS 读取，防止 XSS 攻击
    secure: process.env.NODE_ENV === "production", // 生产环境启用 HTTPS
    sameSite: "lax",   // 防止 CSRF 攻击
    maxAge: TOKEN_EXPIRY_HOURS * 60 * 60, // Cookie 有效期（秒）
    path: "/",         // 全站可用
  });
}

/**
 * 清除认证 Cookie（用户登出时使用）
 * @param response NextResponse 响应对象
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,  // 立即过期
    path: "/",
  });
}

/**
 * 服务端组件 / 服务端动作中获取当前认证 Token
 * @returns token 或 null
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

/**
 * 获取当前登录用户信息（服务端使用）
 * @returns 用户信息 / null（未登录）
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

/**
 * 从请求头中提取 Cookie 里的 Token
 * 用于 API 路由中获取用户登录状态
 * @param request 请求对象
 * @returns token 或 null
 */
export function extractTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  
  // 把 Cookie 字符串解析成对象
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return cookies[AUTH_COOKIE_NAME] ?? null;
}