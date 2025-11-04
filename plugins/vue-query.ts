import type { VueQueryPluginOptions } from '@tanstack/vue-query';
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from '@tanstack/vue-query';

export default defineNuxtPlugin({
  name: 'vue-query',
  enforce: 'pre',
  setup(nuxtApp) {
    const vueQueryState = useState<unknown>('vue-query');

    // Create QueryClient
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 2,
          gcTime: 6 * 60 * 1000, // 6 minutes
          refetchOnWindowFocus: false,
        },
      },
    });

    const options: VueQueryPluginOptions = {
      queryClient,
    };

    nuxtApp.vueApp.use(VueQueryPlugin, options);

    // SSR: Dehydrate state on server
    if (import.meta.server) {
      nuxtApp.hooks.hook('app:rendered', () => {
        vueQueryState.value = dehydrate(queryClient);
      });
    }

    // Client: Hydrate state from server
    if (import.meta.client) {
      nuxtApp.hooks.hook('app:created', () => {
        hydrate(queryClient, vueQueryState.value);
      });
    }
  },
});
