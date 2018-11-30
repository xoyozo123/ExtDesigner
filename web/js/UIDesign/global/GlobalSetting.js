/*
全局设置
*/
Ext.define('UIDesign.global.GlobalSetting', {
        //extend: 'Ext.Base',
        singleton: true,
        constructor: function (config) {
            this.initConfig(config);
            this.callParent(arguments);
            //正在编辑的组件
            this._editingComponent=null;
            //容器组件默认宽度
            this.containerDefaultWidth=400;
            //容器组件默认高度
            this.containerDefaultHeight=300;
        }
    }
);