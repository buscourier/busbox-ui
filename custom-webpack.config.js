const Dotenv = require('dotenv-webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['postcss-loader'],
        // Важно: исключаем файлы, которые уже обрабатывает Angular
        exclude: /node_modules/,
        // Или более точно - только для ваших файлов
        include: /src/,
      },
    ],
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
  ],
};
