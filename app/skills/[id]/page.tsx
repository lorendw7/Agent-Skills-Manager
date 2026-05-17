import { getSkills } from "../SKILLS";
import { notFound } from "next/navigation";
// 服务端组件可以直接 async + 获取 params
export default async function SkillPage({
  params,
}: {
  params: { id: string };
}) {
  const skills = await getSkills();
  const {id} = await params;
  const skill = skills.find((item) => item.id === id);

  return skill ? (
    <article className="p-4 max-w-md mx-auto flex flex-col gap-4">
      <h1>{skill.name}</h1>
      <p>{skill.description}</p>
      <p>{skill.category}</p>
      <p>{skill.createdAt}</p>
      <p>{skill.updatedAt}</p>
    </article>
  ) : (
    notFound()
  );
}