import { mockSkills } from "../SKILLS";

type SkillPageProps = {
  params: {
    id: string
  }
};

export default async function SkillPage(
  { params }: SkillPageProps
) {
  const { id } = await params;
  const skill = mockSkills.find((skill) => skill.id === id);
  return skill ? (
    <article>
    <h1>{skill?.name}</h1>
    <p>{skill?.description}</p>
    <p>{skill?.category}</p>
    <p>{skill?.createdAt}</p>
    <p>{skill?.updatedAt}</p>
  </article>
  ) : (
    <div>Skill not found</div>
  );
}