const
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    fs = require('fs'),
    extractSass = new ExtractTextPlugin({
        filename: "[name].css",
        disable: process.env.NODE_ENV === "development"
    });

var
    __root = "/code/web/",    // webpack용 절대경로
    entries = tour(__root + 'web-resources/script/', "", {});

/*
 *  타겟폴더를 전체 순회하면서 파일 리스트를 골라낸다.
 */
function tour(rootPath, subPath, obj) {
    var path = rootPath + subPath;

    fs.readdirSync(path).forEach(function (fName) {

        // 몇가지 유형은 컴파일에서 제외시킨다.
        if (/^_|^\$|^\.|\.d\./.test(fName)) return;

        //  ① typescript
        if (/ts$/.test(fName)) {
            obj[subPath + fName.replace(/\.ts$/, '') + '.js'] = path + fName;
        }

        /*else if (/scss$/.test(fName)) {
            obj[subPath + fName.replace(/\.scss$/, '') + '.css'] = path + fName;
        }*/

        // ② 폴더일 경우 순회한다.
        else if (fs.statSync(path + fName).isDirectory()) {
            tour(rootPath, subPath + fName + '/', obj)
        }
    });

    return obj;
}

console.log('\n----------------------------\n', entries, '\n----------------------------\n')


module.exports = {
    entry: entries,
    output: {
        path: __root + 'src/main/resources/static/dist/',
        filename: '[name]'
    },

    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },

    module: {

        rules: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "sass-loader"
                    ]
                })
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },


    plugins: [
        new ExtractTextPlugin({
            filename: 'dist/[name].bundle.css',
            allChunks: true,
        })
    ]
};
