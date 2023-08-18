import { resolve } from 'path';

const config = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': resolve(__dirname, 'src'),
    },
    configure: (webpackConfig: any) => {
      if (webpackConfig.mode === 'production') webpackConfig.devtool = false;
      return webpackConfig;
    },
  },
};

export default config;
