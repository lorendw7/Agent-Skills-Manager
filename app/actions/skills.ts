// app/actions/skills.ts

// 声明这是一个「服务器端 Action」，只能在服务端运行，无法在客户端执行
"use server";

// 导入添加技能的工具函数（来自技能数据模块）
import { addSkill } from "../skills/SKILLS";
// 导入 Next.js 提供的路径重验证函数，用于更新指定页面的缓存
import { revalidatePath } from "next/cache";
// 导入 Next.js 提供的服务端重定向函数
import { redirect } from "next/navigation";

/**
 * 创建新技能的服务器端 Action
 * @param prevState - 表单提交前的状态（React Server Action 约定参数）
 * @param formData - 表单提交的数据（FormData 格式）
 * @returns 错误信息对象（当表单校验失败时）
 */
export async function createSkill(prevState: any, formData: FormData) {
    // 从表单数据中提取技能名称，并转为字符串
    const name = formData.get("name") as string;
    // 从表单数据中提取技能描述，并转为字符串
    const description = formData.get("description") as string;
    // 从表单数据中提取技能分类，并转为字符串
    const category = formData.get("category") as string;

    // 校验：如果有任何一个字段为空，返回错误信息
    if (!name || !description || !category) {
        return { message: "Please fill in all fields" };
    }

    // 构造新技能对象
    const newSkill = {
        // 使用当前时间戳作为唯一ID（字符串格式）
        id: Date.now().toString(),
        // 技能名称
        name,
        // 技能描述
        description,
        // 技能分类
        category,
        // 创建时间（ISO 8601 格式字符串）
        createdAt: new Date().toISOString(),
        // 更新时间（与创建时间一致，后续可修改）
        updatedAt: new Date().toISOString(),
    };

    // 调用工具函数，将新技能添加到数据存储中
    await addSkill(newSkill);
    // 触发 /skills 页面的缓存重验证，让用户能立刻看到新增的技能
    revalidatePath("/skills");
    // 操作完成后，重定向到技能列表页面
    redirect("/skills");
}