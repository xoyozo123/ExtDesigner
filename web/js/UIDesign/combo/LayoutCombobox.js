/*
布局下拉框
*/
Ext.define('UIDesign.combo.LayoutCombobox', {
    extend: 'Ext.form.field.ComboBox',
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    },
    initComponent:function(){
        var layouts = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data : [
                {"name":"自动", "value":"autocontainer"},
                {"name":"边框", "value":"border"},
                {"name":"水平盒子", "value":"hbox"},
                {"name":"垂直盒子", "value":"vbox"},
                {"name":"锚点", "value":"anchor"}
            ]
        });
        Ext.apply(this,{
            fieldLabel: 'Choose Layout',
            store: layouts,
            queryMode: 'local',
            displayField: 'value',
            valueField: 'value'
        });
        this.callParent(arguments);
    }

    }
);