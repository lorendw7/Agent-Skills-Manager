"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

/**
 * 用户信息结构
 * 这里定义前端需要保存的用户基础信息
 */
interface User {
  id: number;
  email: string;
  name: string;
}

/**
 * 认证状态结构
 * user：当前登录用户信息
 * isAuthenticated：是否已经登录
 * isLoading：是否正在检查登录状态
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * 登录表单参数
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * 注册表单参数
 * 注册比登录多一个 name 字段
 */
interface RegisterCredentials extends LoginCredentials {
  name: string;
}

/**
 * 后端认证接口返回的数据结构
 */
interface AuthResponse {
  user: User;
  message?: string;
  error?: string;
}

/**
 * AuthContext 提供给全局组件使用的能力
 * 继承 AuthState，并额外提供登录、注册、退出、检查登录状态等方法
 */
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * 创建认证上下文
 * 初始值为 undefined，用于后续判断 useAuth 是否在 AuthProvider 内部使用
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 * 
 * 用于包裹应用，使所有子组件都可以通过 useAuth 共享登录状态。
 * 通常放在 app/layout.tsx 或 Providers 组件中。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  /**
   * 全局认证状态
   * 页面首次加载时 isLoading 为 true，表示正在检查用户是否已登录
   */
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  /**
   * 检查当前用户是否已经登录
   * 
   * 通过请求 /api/auth/me 判断后端是否能识别当前用户。
   * credentials: "include" 表示请求时携带 Cookie，
   * 适用于基于 Cookie / Session 的登录方案。
   */
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        // 后端返回用户信息，说明当前用户已登录
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // 后端返回非 2xx，说明未登录或登录状态失效
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      // 网络错误或接口异常时，也视为未登录
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  /**
   * 组件挂载时自动检查登录状态
   * 
   * 这样刷新页面后，前端可以根据 Cookie 重新恢复用户登录状态。
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * 登录方法
   * 
   * 调用 /api/auth/login 接口。
   * 登录成功后，立即更新全局 authState，
   * 这样页面上的其他组件可以立刻感知到登录状态变化。
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data: AuthResponse = await response.json();

      // 登录失败时，将后端返回的错误信息抛出给调用方处理
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // 登录成功后，立即更新全局登录状态
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    },
    []
  );

  /**
   * 注册方法
   * 
   * 调用 /api/auth/register 接口。
   * 注册成功后，默认认为用户已经登录，
   * 因此直接更新全局 authState。
   */
  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data: AuthResponse = await response.json();

      // 注册失败时，将后端返回的错误信息抛出
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // 注册成功后，立即更新全局登录状态
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    },
    []
  );

  /**
   * 退出登录方法
   * 
   * 调用 /api/auth/logout 清除服务端 Cookie / Session。
   * 即使接口请求失败，也会在前端清空登录状态，避免用户继续停留在已登录状态。
   */
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // 即使退出接口失败，也继续执行前端登出逻辑
    }

    // 清空前端认证状态
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // 退出后跳转到登录页
    router.push("/login");
  }, [router]);

  /**
   * 提供给 AuthContext 的值
   * 
   * 包含当前认证状态，以及登录、注册、退出、检查登录状态等方法。
   */
  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook
 * 
 * 用于在任意子组件中获取认证状态和认证方法。
 * 所有使用 useAuth 的组件共享同一份 AuthContext 状态。
 * 
 * 示例：
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  /**
   * 如果组件没有被 AuthProvider 包裹，
   * 这里会主动抛出错误，方便开发时快速定位问题。
   */
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}