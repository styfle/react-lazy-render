module.exports = {
  context: __dirname,
  entry: './src/LazyRender.jsx',
  output: {
    library: 'LazyRender',
    libraryTarget: 'umd',
    path: './dist/',
    filename: 'LazyRender.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets: ['react']}
      }
    ]
  },
  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    }
  }
};
