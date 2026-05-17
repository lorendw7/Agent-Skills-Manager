import Link from "next/link";
import { getSkills } from "./SKILLS";

export default async function Skills() {

    const skills = await getSkills(); // Assuming getSkills() is an async function that fetches the skills

    console.log("Skills Page Loaded with Skills:", skills);
    return <section className="p-4 flex flex-col gap-4 max-w-md mx-auto">
    <h1>Skills</h1>
    <Link href="/skills/create" className="btn btn-primary self-end">Create Skill</Link>
    <ul className="list-disc list-inside">
        {skills.map((skill, index) => (
            <li key={index}>
                <Link href={`/skills/${skill.id}`}>
                    {skill.name}
                </Link>
            </li>
        ))}
    </ul>
    </section>
}