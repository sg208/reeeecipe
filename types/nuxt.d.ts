import type { DefineComponent } from 'vue';
import type { ApiFetchOptions, AuthUser } from './index';

declare module '#app' {
  interface NuxtApp {
    $apiFetch<T>(request: string, options?: ApiFetchOptions): Promise<T>;
    $apiGetCurrentUser(): Promise<AuthUser | null>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $apiFetch<T>(request: string, options?: ApiFetchOptions): Promise<T>;
    $apiGetCurrentUser(): Promise<AuthUser | null>;
  }
}

declare module '*.vue' {
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export default component;
}
