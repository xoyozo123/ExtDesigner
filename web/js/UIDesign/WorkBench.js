Ext.define('UIDesign.WorkBench', {
    extend: 'Ext.panel.Panel',
    title: 'xQuant UI Designer',
    requires: ['UIDesign.DesignZone'],
    layout: {
        type: 'border'
    },
    itemId:'workBench',
    initComponent: function () {

        var store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: [
                    {
                        text: "panel", leaf: false, expanded: true,
                        children: [
                            { text: "panel", leaf: true },
                            { text: "grid", leaf: true },
                            { text: "treepanel", leaf: true },
                            { text: "form", leaf: true }
                        ]
                    },
                    {
                        text: "field", leaf: false, expanded: true,
                        children: [
                            { text: 'textfield', leaf: true },
                            { text: 'numberfield', leaf: true }
                        ]
                    }
                ]
            }
        });

        this.items = [{
            xtype: 'treepanel',
            title: '组件箱',
            rootVisible: false,
            store: store,
            split: true,
            region: 'west',
            width: 150,
            viewConfig: {
                plugins: {
                    ptype: 'treeviewdragdrop',
                    ddGroup: 'dd',
                    dragText: '拖拽完成排序'
                }

            }
        }, {
            xtype: 'designzone',
            title: '设计区',
            region: 'center'
        }, {
            xtype: 'container',
            region: 'east',
            split: true,
            width: 200,
            hegith: '100%',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            defaults: {
                width: '100%'
            },
            items: [
                {
                    xtype: 'treepanel',
                    title: '组件层级树',
                    flex: 1,
                    itemId:'componentHierarchyTree'
                },
                {
                    xtype: 'panel',
                    title: '组件属性',
                    flex: 1,
                    itemId:'componentConfig'
                }

            ]
        }];
        this.callParent(arguments);
    }
});