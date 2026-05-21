/**
 * Skills 页面加载状态组件
 *
 * 在 Next.js App Router 中，如果某个路由目录下存在 loading.tsx，
 * 当页面数据还在加载时，Next.js 会自动显示这个组件。
 *
 * 这里主要用于展示骨架屏 Skeleton，
 * 让用户知道页面内容正在加载，而不是空白页面。
 */
export default function SkillsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面顶部区域的骨架屏：模拟标题、说明文字和右侧标签 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* 模拟页面标题 */}
          <div className="skeleton h-8 w-64"></div>

          {/* 模拟页面副标题 / 描述文字 */}
          <div className="skeleton h-4 w-48 mt-2"></div>
        </div>

        {/* 模拟右侧 ISR 标签 */}
        <div className="skeleton h-8 w-24"></div>
      </div>

      {/* 
        模拟 Skills 卡片列表
        
        响应式布局：
        - 默认单列
        - md 屏幕：2 列
        - lg 屏幕：3 列
      */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 
          渲染 6 个骨架卡片
          
          [1, 2, 3, 4, 5, 6].map(...)
          用来快速生成多个占位卡片。
        */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              {/* 模拟 Skill 标题 */}
              <div className="skeleton h-6 w-3/4"></div>

              {/* 模拟 Skill 描述第一行 */}
              <div className="skeleton h-4 w-full mt-2"></div>

              {/* 模拟 Skill 描述第二行 */}
              <div className="skeleton h-4 w-2/3 mt-1"></div>

              {/* 模拟卡片底部：作者名称和创建日期 */}
              <div className="flex justify-between mt-4">
                {/* 模拟作者名称 */}
                <div className="skeleton h-4 w-20"></div>

                {/* 模拟日期 */}
                <div className="skeleton h-4 w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}