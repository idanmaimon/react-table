var path = require('path');
var webpack = require('webpack');

var uglify = new webpack.optimize.UglifyJsPlugin({
	compress: {
		warnings: false
	}	
});


module.exports = {
	entry: './src/index.jsx',

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js',

        libraryTarget: 'umd',
        library: 'Table'
	},
	
	externals: {
		'react': true
	},

	module: {
		loaders: [
			{
				test: /\.jsx$/,
				loader: 'babel-loader'
			}
		],
	},

	plugins: [/*uglify*/]
};
