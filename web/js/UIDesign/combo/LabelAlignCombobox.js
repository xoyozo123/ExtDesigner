/*
标签对齐下拉框
*/
Ext.define('UIDesign.combo.LabelAlignCombobox', {
    extend: 'Ext.form.field.ComboBox',
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    },
    initComponent:function(){
        var aligns = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data : [
                {"name":"左", "value":"left"},
                {"name":"上", "value":"top"},
                {"name":"右", "value":"right"}
            ]
        });
        Ext.apply(this,{
            fieldLabel: 'Choose LabelAlign',
            store: aligns,
            queryMode: 'local',
            displayField: 'value',
            valueField: 'value'
        });
        this.callParent(arguments);
    }

    }
);