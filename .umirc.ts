import { defineConfig } from 'umi';

export default defineConfig({
  dynamicImport: {},
  nodeModulesTransform: {
    type: 'none'
  },
  devtool: 'source-map',
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/',
          component: '@/pages/editor/Container'
        }
      ]
    }
  ],
  webpack5: {},
  workerLoader: {},
  fastRefresh: {}
});
