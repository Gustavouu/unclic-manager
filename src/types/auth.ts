
export interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, userData?: any) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface UserSession {
  user: any;
  access_token: string;
  refresh_token: string;
  expires: number;
}

export interface AuthResponse {
  user: any;
  session: UserSession;
  access_token: string;
  refresh_token: string;
}
