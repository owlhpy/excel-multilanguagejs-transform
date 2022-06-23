/*
 * @Author: peiyanh
 * @Date: 2022-06-05 17:27:58
 * @LastEditTime: 2022-06-22 17:29:57
 * @LastEditors: peiyanh
 * @Description: 
 * @FilePath: /learn/excel-to-js/rollup.config.js
 * Copyright (c) 2004-2021 i-Sprint Technologies, Inc.
 *  address: 
 *  All rights reserved. 
 *  
 *  This software is the confidential and proprietary information of 
 *  i-Sprint Technologies, Inc. ('Confidential Information').  You shall not 
 *  disclose such Confidential Information and shall use it only in 
 *  accordance with the terms of the license agreement you entered into 
 *  with i-Sprint. 
 */
//rollup.dev.js
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dev from 'rollup-plugin-dev'
import nodePolyfills from 'rollup-plugin-polyfill-node';


export default {
	input: "./src/index.js",
	output: [
		{
			file: './dist/index-umd.js',
			format: 'umd',
			name: 'myLib'
			//当入口文件有export时，'umd'格式必须指定name
			//这样，在通过<script>标签引入时，才能通过name访问到export的内容。
		},
		{
			file: './dist/index-es.js',
			format: 'es'
		},
		{
			file: './dist/index-cjs.js',
			format: 'cjs'
		},
	],
	watch: {
		include: 'src/**/*'
	},

	plugins: [
		nodePolyfills(),
		commonjs(),
		babel({ babelHelpers: 'bundled', extensions: ['.js'] }),
		nodeResolve(),
		dev({ force: true })
	]
}
