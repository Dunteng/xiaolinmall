/*
 * @Author: Dunteng 
 * @Date: 2019-04-09 14:00:55 
 * @Last Modified by: Dunteng
 * @Last Modified time: 2019-04-10 15:42:24
 */

// module.exports = {
//     entry: './src/page/index/index.js',
//     output: {
//         path: './dist',
//         filename: 'app.js'
//     }
// };
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置， dev / online  开发环境和线上
// nodejs里有一个环境变量一般命名为NODE_ENV, 不过我们还是换一个名字WEBPACK_ENV避免和别的变量命名冲突
// process.env.WEBPACK_ENV在哪里定义呢？在我们启动webpack-dev-server的时候加的参数，然后就可以定义出来它了
// 用console.log看看这个WEBPACK_ENV是什么东西
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';//默认使用dev
console.log(WEBPACK_ENV);

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name) { 
    return {
        template: './src/view/'+name+'.html',
        filename: 'view/'+name+'.html',
        inject: true,
        hash: true,
        chunks: ['common', name]   
    };
 };

//  webpack config
var config = {
    entry: {
        'common': ['./src/page/common/index.js'],
        'index': ['./src/page/index/index.js'],
        'login': ['./src/page/login/index.js']
    },
    output: {
        // path时文件打包存放时的路径
        path: './dist',
        // publicPath是网页访问时的路径
        publicPath: '/dist',
        filename: 'js/[name].js'
    },
    externals: {
        'jquery': 'window.jQuery'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader")  },
            { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]'  }
        ]
    },
    plugins: [
        //独立通用模块到dist/js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),
        //把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        //html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index')),
        new HtmlWebpackPlugin(getHtmlConfig('login'))
    ]
};

if('dev'===WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config;