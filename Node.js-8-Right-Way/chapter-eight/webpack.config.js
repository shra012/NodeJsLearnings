'use strict';
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './app/index.ts',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: distDir,
    },
    devServer: {
        static: distDir,
        port: 60800,
        proxy: {
            '/api': 'http://localhost:60702',
            '/es': {
                target: 'http://localhost:9200',
                pathRewrite: { '^/es': ''},
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Better Book Bundle Builder',
        }),
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000
                        },
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
};