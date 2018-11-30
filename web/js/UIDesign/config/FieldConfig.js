/*
Field常用配置
*/
Ext.define('UIDesign.config.FieldConfig', {
        //extend: 'Ext.Base',
        singleton: true,
        constructor: function (config) {
            this.initConfig(config);
            this.callParent(arguments);
            //文本域
            this.textfield=['width', 'height', 'fieldLabel', 'labelAlign', 'labelWidth', 'allowBlank'];
            //数字域
            this.numberfield=this.textfield.concat(['allowDecimals','decimalPrecision','minValue','maxValue']);
        }
    }
);