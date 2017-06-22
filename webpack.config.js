const path = require('path'),
    webpack = require('webpack'),
    NODE_ENV = process.env.NODE_ENV || 'DEV',  // DEV PROD
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    vuxLoader = require('vux-loader');

let webpackConfig = {
    entry: ['babel-polyfill', './src/js/main.js'],
    output: {
        path: NODE_ENV === 'DEV' ? '/' : path.resolve(__dirname, './build'),
        //publicPath路径就是你发布之后的路径，
        // 比如你想发布到你站点的/util/vue/build 目录下, 那么设置publicPath: "/util/vue/build/"
        // 此字段配置如果不正确，发布后资源定位不对，比如：css里面的精灵图路径错误
        publicPath: NODE_ENV === 'DEV' ? '/build/' : './build/',
        filename: NODE_ENV === 'DEV' ? 'main.js' : 'main.[hash].js',
        chunkFilename: NODE_ENV ==='DEV'?'[name].js':'[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                exclude: /^node_modules$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: "file-loader",
                    query: {
                        limit: 10000,
                        name: '[name].[ext]'
                    }
                }]
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    query: {
                        limit: 5000,
                        name: 'font/[name].[hash:7].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "../index.html", //生成的html存放路径，相对于 path
            template: './src/index.html', //html模板路径
            favicon: "./src/image/logo.png",
            inject: true, //允许插件修改哪些内容，包括head与body
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false, //删除空白符与换行符
                //removeAttributeQuotes: true
            }
        })
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue', '.css'], //后缀名自动补全
    },
    devServer: {
        historyApiFallback: true, //配置为true, 当访问的文件不存在时, 返回根目录下的index.html文件
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

module.exports = vuxLoader.merge(webpackConfig, {
    plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
})

var fileSystem = require('fs');
//打包状态
if (NODE_ENV === "PROD") {
    module.exports.devtool = false;
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"PROD"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: false
        })
    ]);
} else {
    //本地运行状态把index.html中的href、src连接修改掉
    fileSystem.readFile("index.html", 'utf-8', function (err, data) {
        if (err) {
            console.log("error");
        } else {
            //将index.html里面的hash值清除掉
            var devhtml = data.replace(/((?:href|src)="[^"]+\.)(\w{20}\.)(js|css)/g, '$1$3');
            fileSystem.writeFileSync('index.html', devhtml);
        }
    });
}