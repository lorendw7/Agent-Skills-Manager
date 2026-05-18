// 导入 Prisma 客户端核心类，用于操作数据库
import { PrismaClient } from "@prisma/client";

// 导入 Prisma 针对 PostgreSQL 的适配器
import { PrismaPg } from "@prisma/adapter-pg";

// 导入 pg 库的连接池，用于管理数据库连接
import { Pool } from "pg";

/**
 * 定义全局变量类型
 * 目的：防止开发环境下热重载创建多个 Prisma 实例
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 创建并配置 Prisma 客户端实例
 * 手动配置 PostgreSQL 连接池 + 适配器，比默认方式更灵活
 */
function createPrismaClient() {
  // 创建 PostgreSQL 连接池，使用环境变量中的数据库连接字符串
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 将连接池传给 Prisma 的 PostgreSQL 适配器
  const adapter = new PrismaPg(pool);
  
  // 返回带自定义适配器的 Prisma 客户端
  return new PrismaClient({ adapter });
}

/**
 * 单例模式导出 prisma 实例
 * 优先从全局变量获取，不存在则创建新实例
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

/**
 * 开发环境下，将 prisma 实例挂载到全局对象
 * 避免 Next.js/Nuxt 等框架热重载时，重复创建数据库连接
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}