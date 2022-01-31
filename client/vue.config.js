module.exports = {

    configureWebpack: {
      devServer: {
        historyApiFallback: true,
        proxy: {
          '^/bike': {
            target: 'http://localhost:3000',
            changeOrigin: true
          },
        }      
      }
    }
  
  };