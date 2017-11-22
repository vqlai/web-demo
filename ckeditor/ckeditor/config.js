/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

// 在这里进行ckeditor的配置 
CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.language = 'zh-cn';
	//字体
	config.font_names ='宋体;楷体;新宋体;黑体;隶书;微软雅黑;Arial;Comic Sans MS;Courier New;Tahoma;Times New Roman;Verdana';
	config.height = 500;
	// 工具栏是否可以被收缩
	// config.toolbarCanCollapse = true;
	// 取消 “拖拽以改变尺寸”功能 plugins/resize/plugin.js
	config.resize_enabled = false;
	// 移除图片弹窗与链接弹窗多余的tab
	config.removeDialogTabs = 'link:advanced;link:target;image:advanced;image:Link;'; 
	config.toolbar = [
		{ name: 'clipboard', items: [ '-', 'Undo', 'Redo' ] },
		{ name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-' ] },
		{ name: 'colors', items: [ 'TextColor' ] },
		{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', ] },
		{ name: 'links', items: [ 'Link', 'Unlink' ] },
		{ name: 'insert', items: [ 'Image', 'Table'] },
		{ name: 'document', items: [ 'Print', '-' ] },
		{ name: 'tools', items: [ 'Maximize'] }
	];
};
