type Skill = {
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
    description: "静态类型的JavaScript超集，提升代码可维护性与开发效率",
    category: "前端开发",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-05-10T14:20:00Z"
  },
  {
    id: "skill_002",
    name: "Spring Boot",
    description: "基于Java的后端快速开发框架，简化企业级应用搭建流程",
    category: "后端开发",
    createdAt: "2024-02-20T10:15:00Z",
    updatedAt: "2024-05-08T09:45:00Z"
  },
  {
    id: "skill_003",
    name: "Python 数据分析",
    description: "使用Pandas、NumPy进行数据清洗、分析与可视化",
    category: "数据科学",
    createdAt: "2024-03-05T16:40:00Z",
    updatedAt: "2024-05-12T11:30:00Z"
  },
  {
    id: "skill_004",
    name: "Docker 容器化",
    description: "容器化部署与编排，实现开发、测试、生产环境一致性",
    category: "DevOps",
    createdAt: "2024-04-01T12:00:00Z",
    updatedAt: "2024-05-11T15:10:00Z"
  }
];