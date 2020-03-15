const path = require('path')
const fs = require('fs')
const HtmlPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

function generateHtmlPlugins(templateDir) {
	var plugins = []
	const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
	templateFiles.map(item => {
		const parts = item.split('.')
		const name = parts[0]
		const extension = parts[1]
		if (extension == 'pug') plugins.push(new HtmlPlugin({
			filename: `${name}.html`,
			template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
			favicon: './frontend/images/favicon.ico'
		}))
	})
	return plugins;
}

const htmlPlugins = generateHtmlPlugins('./frontend')

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: ['./frontend/scss/app.scss'],
	output: {
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
			test: /\.scss$/,
			exclude: /node_modules/,
			use: [{
					loader: 'file-loader',
					options: {
						name: 'css/[name].css',
					}
				},
				{
					loader: 'extract-loader'
				},
				{
					loader: 'css-loader?-url'
				},
				{
					loader: 'postcss-loader'
				},
				{
					loader: 'sass-loader'
				}
			]
		}, {
			test: /\.pug$/,
			use: [
			  {
				loader: 'pug-loader',
				options: {
					pretty: true
				}
			  }
			]
		}]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([{
				from: 'frontend/images',
				to: 'images'
			},
			{
				from: 'frontend/scss/fonts',
				to: 'fonts'
			},
			{
				from: 'frontend/js',
				to: 'js'
			},
			{
				from: 'frontend/lib',
				to: 'lib'
			}
		])
	].concat(htmlPlugins)
};