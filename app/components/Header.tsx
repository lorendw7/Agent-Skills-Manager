// 导出一个名为 Header 的默认组件，用于渲染网站的顶部导航栏
export default function Header() {
  return (
    /* 
      daisyUI 导航栏容器
      - navbar：daisyUI 导航栏布局类
      - bg-base-100：设置背景色为主题的基础色（白色/浅色）
      - shadow-sm：添加轻微阴影，增强层次感
    */
    <div className="navbar bg-base-100 shadow-sm">
      {/* 
        左侧品牌/Logo 按钮
        - btn btn-ghost：幽灵按钮样式（透明背景，hover 才变色）
        - text-xl：字体大小为 xl 级
        - 显示文本为 "daisyUI"
      */}
      <a className="btn btn-ghost text-xl">daisyUI</a>

      {/* 
        弹性占位元素，flex-1 会自动填充剩余空间
        作用是把左侧 Logo 和右侧导航菜单挤到两端
      */}
      <div className="flex-1"></div>

      {/* 
        水平导航菜单列表
        - menu：daisyUI 菜单基础类
        - menu-horizontal：设置为水平排列
        - p-0：取消默认内边距，让菜单更紧凑
      */}
      <ul className="menu menu-horizontal p-0">
        {/* 导航项：Skills（技能页面入口） */}
        <li>
          <a href="/skills">Skills</a>
        </li>

        {/* 导航项：About（关于页面入口） */}
        <li>
          <a href="/about">About</a>
        </li>

        {/* 导航项：Login（登录页面入口） */}
        <li>
          <a href="/login">Login</a>
        </li>

        {/* 导航项：Register（注册页面入口） */}
        <li>
          <a href="/register">Register</a>
        </li>
      </ul>
    </div>
  );
}