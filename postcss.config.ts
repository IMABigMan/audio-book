// postcss.config.ts

const config = {
  plugins: {
    'autoprefixer': {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
        'last 10 versions',
      ],
      grid: true,
    },
    'postcss-pxtorem': {
      // rootValue: 100, // 1rem = 100px (设计稿750px)
      rootValue: ({ file }: { file: string }) => {
        // 根据文件路径判断是哪个平台
        return file.includes('vant') ? 75 : 100 // Vant使用375px设计稿，其他使用750px设计稿
        return 100
      },
      propList: ['*'], // 需要转换的属性
      unitPrecision: 5, // 转换后的小数点位数
      selectorBlackList: ['.ignore', '.hairlines'], // 排除的选择器
      replace: true, // 替换包含px的规则，而不是添加备用规则
      mediaQuery: false, // 是否在媒体查询中转换px
      minPixelValue: 1, // 设置要替换的最小像素值
      exclude: /node_modules/i, // 排除node_modules文件夹
    },
  },
}

export default config
