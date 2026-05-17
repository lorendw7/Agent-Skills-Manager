export type Skill = {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};


export const mockSkills: Skill[] = [
  {
    id: "skill_001",
    name: "TypeScript",
    description: "A statically typed superset of JavaScript that improves code maintainability and development efficiency",
    category: "Frontend Development",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-05-10T14:20:00Z"
  },
  {
    id: "skill_002",
    name: "Spring Boot",
    description: "A Java-based backend framework for rapid enterprise application development with simplified setup",
    category: "Backend Development",
    createdAt: "2024-02-20T10:15:00Z",
    updatedAt: "2024-05-08T09:45:00Z"
  },
  {
    id: "skill_003",
    name: "Python Data Analysis",
    description: "Data cleaning, analysis, and visualization using Pandas and NumPy",
    category: "Data Science",
    createdAt: "2024-03-05T16:40:00Z",
    updatedAt: "2024-05-12T11:30:00Z"
  },
  {
    id: "skill_004",
    name: "Docker Containerization",
    description: "Containerized deployment and orchestration for consistent development, testing, and production environments",
    category: "DevOps",
    createdAt: "2024-04-01T12:00:00Z",
    updatedAt: "2024-05-11T15:10:00Z"
  }
];

export async function addSkill(newSkill: Skill) {
  await new Promise((resolve) => { setTimeout(resolve, 3000); }); // Simulate async operation
  return [...mockSkills, newSkill];
}

export async function getSkills() {
   await new Promise((resolve) => { setTimeout(resolve, 3000); }); // Simulate async operation
  return [...mockSkills];
}