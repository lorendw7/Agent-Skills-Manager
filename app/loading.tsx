// 默认导出一个全局加载组件
export default function GlobalLoading() {
  return (
    // 设置最小高度为视口高度的 50%，并使用 Flex 布局让内容水平、垂直居中
    <div className="min-h-[50vh] flex items-center justify-center">
      {/* 文本内容居中显示 */}
      <div className="text-center">
        {/* 加载中的旋转图标，使用 DaisyUI 的 loading 样式 */}
        <span className="loading loading-spinner loading-lg text-primary"></span>

        {/* 加载提示文案，上方间距为 4，文字颜色使用较浅的主题文字色 */}
        <p className="mt-4 text-base-content/70">Loading...</p>
      </div>
    </div>
  );
}