import type {
  QueryFunctionContext,
  VueQueryPluginOptions,
} from '@tanstack/vue-query';
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from '@tanstack/vue-query';
import type { ApiFetchOptions } from '~/types';

export default defineNuxtPlugin({
  name: 'vue-query',
  enforce: 'pre',
  setup(nuxtApp) {
    const vueQueryState = useState<unknown>('vue-query');

    const apiFetch = ((
      nuxtApp as unknown as {
        $apiFetch?: <T>(
          request: string,
          options?: ApiFetchOptions
        ) => Promise<T>;
      }
    ).$apiFetch ?? $fetch) as <T>(
      request: string,
      options?: ApiFetchOptions
    ) => Promise<T>;

    const defaultQueryFn = async <TData>(
      context: QueryFunctionContext
    ): Promise<TData> => {
      const [endpoint, params] = context.queryKey as [
        string,
        Record<string, unknown>?,
      ];

      if (typeof endpoint !== 'string') {
        throw new Error(
          'Default query function expects the first queryKey element to be a string endpoint.'
        );
      }

      const fetchOptions: ApiFetchOptions = {
        ...((context.meta?.fetchOptions as ApiFetchOptions | undefined) ?? {}),
      };

      if (params && fetchOptions.query === undefined) {
        fetchOptions.query = params;
      }

      return apiFetch<TData>(endpoint, fetchOptions);
    };

    // Create QueryClient
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 2,
          gcTime: 6 * 60 * 1000, // 6 minutes
          refetchOnWindowFocus: false,
          queryFn: defaultQueryFn,
          meta: {
            fetchOptions: {},
          },
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
