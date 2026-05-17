// 导出技能卡片的骨架屏加载组件
export default function SkillLoading() {
  return (
    // 外层容器：内边距p-6、最大宽度限制、水平居中、上下外边距
    <div className="p-6 max-w-md mx-auto my-4">
      {/* 卡片容器：使用card类和背景色bg-base-200（DaisyUI/Tailwind类） */}
      <div className="card bg-base-200">
        {/* 卡片内容区域 */}
        <div className="card-body">
          {/* 标题骨架：高度h-6，宽度占3/4 */}
          <div className="skeleton h-6 w-3/4"></div>
          {/* 描述骨架：高度h-4，宽度100%，顶部外边距mt-2 */}
          <div className="skeleton h-4 w-full mt-2"></div>
        </div>
      </div>
    </div>
  );
}