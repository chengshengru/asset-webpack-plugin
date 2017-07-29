var webpack = require('webpack');
var AssetWebpackPlugin = require('./asset-webpack-plugin');




module.export = {


	plugins: [
		new AssetWebpackPlugin({
			path:'',
			filename,
			fn:function(compilation, cb){
				cb(null,function(compilation){
					//do something				
				});		
			}		
		})	
	]

};
