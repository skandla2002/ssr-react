const path = require('path');
const paths = require('./paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent'); // CSS 모듈의 고유 className 만들때 필요한 옵션

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/

module.exports = {
    mode: 'production',
    entry: paths.ssrIndexJs,
    target: 'node', // node 환경임을 명시
    output: {
        path: paths.ssrBuild,
        filename: 'server.js',
        chunkFilename: 'js/[name].chunk.js',
        publicPath: paths.serverPath
    },
    module: {
        rules: [
            {
                oneOf: [
                    // 자바스크립트를 위한 처리
                    // 기존 webpack.config.js를 참고하여 작성
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),
                            plugins: [
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent: '@svgr/webpack?-svgo![path]'
                                            }
                                        }
                                    }
                                ]
                            ],
                            cacheDirectory: true,
                            cacheCompression: false,
                            compact: false
                        }
                    },
                    // CSS를 위한 처리
                    {
                        test: cssReget,
                        exclude: cssModuleRegex,
                        // exportOnlyLocals: true 옵션을 설정해야 실제 CSS 파일을 생성하지 않음
                        loader: require.resolve('css-loader'),
                        options: {
                            exportOnlyLocals: true
                        }
                    },
                    // CSS Module을 위한 처리
                    {
                        test: cssModuleRegex,
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: true,
                            exportOnlyLocals: true,
                            getLocalIdent: getCSSModuleLocalIdent
                        }
                    },
                    // Sass를위한 처리
                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        use: [
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    exportOnlyLocals: true
                                }
                            }, require.resolve('sass-loader')
                        ]
                    }
                ]
            }
        ]
    }
}