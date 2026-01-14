export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  thumbnail: string;
  createdBy: string; // user id of creator
  description?: string;
  createdAt: string;
  updatedAt: string;
}
