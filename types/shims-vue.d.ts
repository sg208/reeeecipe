declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  type Component = DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;

  const component: Component;
  export default component;
}
