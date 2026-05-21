"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 定义创建 / 编辑 Skill 时表单提交的数据结构
interface SkillFormData {
  name: string;
  description: string;
  content: string;
  isPublic: boolean;
}

// 定义 Server Action 返回结果的数据结构
interface ActionResult {
  success: boolean;
  error?: string;
  skillId?: number;
}

/**
 * 创建新的 Skill
 *
 * 这是一个 Server Action：
 * - 只能在服务端执行
 * - 可以直接访问数据库
 * - 可以被 Client Component 调用
 *
 * @param data 表单提交的 Skill 数据
 * @param userId 当前登录用户的 id
 * @returns 创建结果，成功时返回 skillId，失败时返回 error
 */
export async function createSkill(
  data: SkillFormData,
  userId: number
): Promise<ActionResult> {
  try {
    // 使用 Prisma 在数据库中创建一条新的 skill 记录
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        isPublic: data.isPublic,

        // authorId 用来记录这个 skill 属于哪个用户
        authorId: userId,
      },
    });

    /**
     * 重新验证相关页面缓存
     *
     * Next.js App Router 中，如果页面使用了缓存数据，
     * 修改数据库后需要 revalidatePath 让页面重新获取最新数据。
     */
    revalidatePath("/skills");
    revalidatePath("/dashboard");

    // 返回创建成功，并把新创建的 skill id 返回给前端
    return { success: true, skillId: skill.id };
  } catch (error) {
    // 创建失败时，在服务端控制台打印错误
    console.error("Create skill error:", error);

    // 返回给前端一个通用错误信息
    return { success: false, error: "Failed to create skill" };
  }
}

/**
 * 更新已有的 Skill
 *
 * 更新前会先检查：
 * - 这个 skill 是否存在
 * - 当前用户是否是这个 skill 的作者
 *
 * 这样可以防止用户修改别人的 skill。
 *
 * @param id 要更新的 skill id
 * @param data 表单提交的新数据
 * @param userId 当前登录用户的 id
 * @returns 更新结果
 */
export async function updateSkill(
  id: number,
  data: SkillFormData,
  userId: number
): Promise<ActionResult> {
  try {
    /**
     * 查询当前 skill 是否存在，并只取 authorId 字段
     *
     * select 的好处：
     * - 只查询需要的字段
     * - 减少数据库返回的数据量
     */
    const existing = await prisma.skill.findUnique({
      where: { id },
      select: { authorId: true },
    });

    /**
     * 权限校验：
     * - 如果 skill 不存在，不能更新
     * - 如果 skill 的作者不是当前用户，也不能更新
     */
    if (!existing || existing.authorId !== userId) {
      return { success: false, error: "Not authorized to edit this skill" };
    }

    // 权限校验通过后，更新数据库中的 skill 内容
    await prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        isPublic: data.isPublic,
      },
    });

    /**
     * 重新验证相关页面缓存
     *
     * /skills：公开 Skill 列表页
     * /skills/${id}：当前 Skill 详情页
     * /dashboard：用户后台页面
     */
    revalidatePath("/skills");
    revalidatePath(`/skills/${id}`);
    revalidatePath("/dashboard");

    // 返回更新成功
    return { success: true, skillId: id };
  } catch (error) {
    // 更新失败时，在服务端控制台打印错误
    console.error("Update skill error:", error);

    // 返回给前端一个通用错误信息
    return { success: false, error: "Failed to update skill" };
  }
}

/**
 * 删除指定的 Skill
 *
 * 删除前会先检查：
 * - 这个 skill 是否存在
 * - 当前用户是否是这个 skill 的作者
 *
 * 这样可以防止用户删除别人的 skill。
 *
 * @param id 要删除的 skill id
 * @param userId 当前登录用户的 id
 * @returns 删除结果
 */
export async function deleteSkill(
  id: number,
  userId: number
): Promise<ActionResult> {
  try {
    /**
     * 查询当前 skill 的作者 id
     *
     * 这里只查询 authorId，
     * 因为删除前只需要判断当前用户是否有权限。
     */
    const existing = await prisma.skill.findUnique({
      where: { id },
      select: { authorId: true },
    });

    /**
     * 权限校验：
     * - skill 不存在，不能删除
     * - 当前用户不是作者，不能删除
     */
    if (!existing || existing.authorId !== userId) {
      return { success: false, error: "Not authorized to delete this skill" };
    }

    // 权限校验通过后，删除数据库中的 skill
    await prisma.skill.delete({
      where: { id },
    });

    /**
     * 删除后重新验证相关页面缓存
     *
     * 因为 skill 列表和 dashboard 中的数据都发生了变化。
     */
    revalidatePath("/skills");
    revalidatePath("/dashboard");

    // 返回删除成功
    return { success: true };
  } catch (error) {
    // 删除失败时，在服务端控制台打印错误
    console.error("Delete skill error:", error);

    // 返回给前端一个通用错误信息
    return { success: false, error: "Failed to delete skill" };
  }
}