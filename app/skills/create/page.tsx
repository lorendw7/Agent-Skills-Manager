// app/skills/create/page.tsx

// 声明为客户端组件，因为要使用 React 状态和交互
"use client";

// 导入 useActionState 钩子，用于管理服务端 Action 的表单状态
import { useActionState } from "react";
// 导入之前写的创建技能的服务器 Action
import { createSkill } from "@/app/actions/skills";

// 定义表单的初始状态，用于接收服务器 Action 返回的消息（比如错误提示）
const initialState = {
  message: "", // 初始时没有提示信息
};

// 默认导出创建技能页面的组件
export default function NewSkillPage() {
  // 使用 useActionState 绑定服务器 Action：
  // - state: 服务器 Action 返回的状态（比如错误消息）
  // - formAction: 绑定到表单的提交函数
  // - pending: 提交中的加载状态（布尔值）
  const [state, formAction, pending] = useActionState(createSkill, initialState);

return (
  <form action={formAction} className="p-4 max-w-md mx-auto form flex flex-col gap-4">
    {/* 技能名称输入框，name="name" 会被 formData.get("name") 读取 */}
    <input name="name" placeholder="Skill Name" className="input input-bordered w-full" />

    {/* 技能描述文本域，name="description" 会被 formData.get("description") 读取 */}
    <textarea name="description" placeholder="Skill Description" rows={3} className="input input-bordered w-full" />

    {/* 技能分类输入框，name="category" 会被 formData.get("category") 读取 */}
    <input name="category" placeholder="Skill Category" className="input input-bordered w-full" />

    {/* 显示服务器 Action 返回的提示信息（比如“请填写所有字段”）
        aria-live="polite" 让屏幕阅读器自动朗读更新的内容 */}
    <p aria-live="polite" className="text-red-500">{state?.message}</p>

    {/* 提交按钮，pending 为 true 时禁用并显示“Creating...” */}
    <button disabled={pending} className="btn btn-primary">
      {pending ? "Creating ..." : "Create Skill"}
    </button>
  </form>
);
}