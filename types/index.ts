import type { FetchOptions } from 'ofetch';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
  slug?: string; // Computed slug for SEO-friendly URLs
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string | null;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export type ApiFetchOptions = FetchOptions & {
  auth?: boolean;
};
