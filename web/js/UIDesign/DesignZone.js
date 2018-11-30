Ext.define('UIDesign.DesignZone',{
    
    extend:'Ext.panel.Panel',
    requires:['UIDesign.config.FieldConfig',
              'UIDesign.global.GlobalSetting'],
    title:'设计区',
    xtype:'designzone',
    autoScroll:true,
    layout:{
        type:'vbox'
    },

    initComponent:function(){
        this.init4Drop();
        this.callParent(arguments);
    },

    init4Drop:function(){

        var me = this;

        me.mon(me,'render',function(){
            
            me.dropTarget = new Ext.dd.DropTarget(me.getEl(), {

                ddGroup: 'dd',
    
                notifyDrop : function (dd, e, data) {

                    if(data.records){

                        var targetCt = me.locateDropTargetCtByPos(e.getX(),e.getY());

                        if(!targetCt && !targetCt.isContainer){
                            return;
                        }
                        targetCt.on('add',function(component, addedComponent, index, opts){
                           var componentHierarchyTree = me.up('#workBench').down('#componentHierarchyTree');
                           var componentHierarchyTreeView = componentHierarchyTree.getView();
                           console.info(componentHierarchyTree);
                           console.info(componentHierarchyTree.getRootNode());
                           if(componentHierarchyTree.getRootNode()==null){
                               componentHierarchyTree.setRootNode({text:me.$className,id:me.getId()});
                           }
                           if(component==me){//直接在设计区添加的组件
                               if(componentHierarchyTree.getRootNode().findChild('id',addedComponent.getId())==null){
                                   componentHierarchyTree.getRootNode().appendChild({text:addedComponent.$className,id:addedComponent.getId()});
                                   componentHierarchyTree.expandAll();
                                   return;
                               }
                               return;
                           }
                           var parentNode = componentHierarchyTree.getRootNode().findChild('id',component.getId(),true);
                           if(parentNode!=null){//在父节点上面添加子节点
                              if(parentNode.findChild('id',addedComponent.getId())==null){
                                  parentNode.appendChild({text:addedComponent.$className,id:addedComponent.getId()});
                                  componentHierarchyTree.expandAll();
                                  return;
                              }
                              return;
                           }

                        });

                        var sizeConfig = me._getContainerSize(targetCt.getLayout().type);

                        var record = data.records[0];
                        if(record.data.text == 'treepanel'){
                            var comp = Ext.widget('treepanel',Ext.apply({
                                title:'treepanel',
                                layout:{
                                    type:'hbox'
                                }
                            },sizeConfig));
                            targetCt.add(comp);
                        }
                        if(record.data.text == 'panel'){
                            var comp = Ext.widget('panel',Ext.apply({
                                title:'panel'
                            },sizeConfig));
                            targetCt.add(comp);
                        }
                        if(record.data.text == 'form'){
                            var comp = Ext.widget('form',Ext.apply({
                                title:'form'
                            },sizeConfig));
                            targetCt.add(comp);
                        }
                        if(record.data.text == 'textfield'){
                            var comp = Ext.widget('textfield',{
                                fieldLabel:'textfield'
                            });
                            targetCt.add(comp);
                        }
                        if(record.data.text == 'numberfield'){
                            var comp = Ext.widget('numberfield',{
                                fieldLabel:'numberfield'
                            });
                            targetCt.add(comp);
                        }
                    }
                    return true;
                }
            });
        });

        me.on('afterrender',function(component ){
            component.body.on('click',function(event, el , opts ){
                //var child = component.getChildByElement(el,true);
                var child = component.locateChildComponentByPos(event.getX(),event.getY());
                console.info(child);
                if(!Ext.isEmpty(UIDesign.global.GlobalSetting._editingComponent)){//如果有之前编辑的组件，则移除正在编辑样式
                    UIDesign.global.GlobalSetting._editingComponent.removeCls('editing');
                    delete UIDesign.global.GlobalSetting._editingComponent;
                }
                if(!Ext.isEmpty(child)){//如果找到了组件，则添加样式
                    child.addCls('editing');
                    UIDesign.global.GlobalSetting._editingComponent = child;
                    if(child['isContainer']==true){//组件是一个容器
                      var componentConfig =  component.up('#workBench').down('#componentConfig');
                      var layoutType = child.getLayout().type;//布局类型
                      if(layoutType=='auto'){
                          layoutType='autocontainer';
                      }
                      console.info(layoutType);

                      var propertyGrid =  Ext.create('Ext.grid.property.Grid',{
                          tbar:[{xtype: 'button', text: '保存',iconCls:'icon-save',handler:function(button,eventObject){
                              console.info('点击了保存~~~');
                              var _propertyGrid = button.up('propertygrid');
                              var gridStore = _propertyGrid.getStore();
                              var dataMap = gridStore.data.map;
                              var layout = dataMap['layout'].get('value')
                              console.info(layout);

                              var _editingComponent = UIDesign.global.GlobalSetting._editingComponent;
                              if(_editingComponent!=null){
                                  if(_editingComponent.isContainer==true){//要操作的组件是容器
                                     var _editingComponentLayout = _editingComponent.getLayout().type;
                                     if(_editingComponentLayout=='auto'){
                                        _editingComponentLayout='autocontainer';
                                     }
                                     if(_editingComponentLayout==layout){//如果组件当前布局和目标布局一致，则不进行操作
                                        return;
                                     }
                                     //进行布局切换操作
                                     var newComponent =component._cloneContainer(_editingComponent,layout);
                                     var parentComponent = _editingComponent.ownerCt;
                                     var index;//组件在父组件中的位置
                                     for(var i =0;i<parentComponent.items.items.length;i++){
                                         if(parentComponent.items.items[i]==_editingComponent){
                                             index = i;
                                             break;
                                         }
                                     }
                                     //更新树节点的id
                                     component._updateTreeNodeId(_editingComponent.getId(),newComponent.getId());
                                     parentComponent.suspendEvents(false);//丢弃所有事件
                                     parentComponent.remove(_editingComponent,false);
                                     parentComponent.insert(index,newComponent);
                                     parentComponent.resumeEvents();
                                     //正在编辑的组件
                                     newComponent.addCls('editing');//组件红线(添加到新组件上)
                                     UIDesign.global.GlobalSetting._editingComponent=newComponent;//正在编辑的组件处理(设置为新组件)
                                     //或者这样处理
                                     //delete UIDesign.global.GlobalSetting._editingComponent;//删除window-->正在编辑的组件
                                     //componentConfig.removeAll(true);//清空组件属性面板

                                  }/*else{//操作的组件不是容器


                                  }*/
                              }

                          }}],
                          source: {
                              layout: layoutType
                          },
                          sourceConfig:{
                              layout:{editor:Ext.create('UIDesign.combo.LayoutCombobox',{hideLabel:true})}
                          }

                      });
                      componentConfig.removeAll(true);
                      componentConfig.add(propertyGrid);

                    }else{//组件不是容器，则清空组件配置
                        var componentConfig =  component.up('#workBench').down('#componentConfig');
                        if(UIDesign.global.GlobalSetting._editingComponent instanceof Ext.form.field.Text){//如果点击的是textfield或者textfield的实例
                          var fieldConfigs = UIDesign.config.FieldConfig[UIDesign.global.GlobalSetting._editingComponent.xtype];
                          var sourceConfig = {};
                          for(var i=0;i< fieldConfigs.length;i++){
                              var key = fieldConfigs[i];
                              var value = UIDesign.global.GlobalSetting._editingComponent[key];
                              if(Ext.isEmpty(value)){
                                var methodName = 'get'+Ext.String.capitalize(key);
                                value = UIDesign.global.GlobalSetting._editingComponent[methodName]();
                              }
                              sourceConfig[key] = value;
                              console.info(key+'-->'+value);
                          }
                          var propertyGrid =  Ext.create('Ext.grid.property.Grid',{
                              tbar:[{xtype: 'button', text: '保存',iconCls:'icon-save',handler:function(button,eventObject){
                                console.info('点击了保存~~~');
                                var _propertyGrid = button.up('propertygrid');
                                var gridStore = _propertyGrid.getStore();
                                var dataMap = gridStore.data.map;
                                console.info(dataMap);

                                var _editingComponent = UIDesign.global.GlobalSetting._editingComponent;
                                if(_editingComponent!=null){
                                    if(_editingComponent.isContainer==true){//要操作的组件是容器
                                        var _editingComponentLayout = _editingComponent.getLayout().type;
                                        if(_editingComponentLayout=='auto'){
                                            _editingComponentLayout='autocontainer';
                                        }
                                        if(_editingComponentLayout==layout){//如果组件当前布局和目标布局一致，则不进行操作
                                            return;
                                        }
                                        //进行布局切换操作
                                        var newComponent =component._cloneContainer(_editingComponent,layout);
                                        var parentComponent = _editingComponent.ownerCt;
                                        var index;//组件在父组件中的位置
                                        for(var i =0;i<parentComponent.items.items.length;i++){
                                            if(parentComponent.items.items[i]==_editingComponent){
                                                index = i;
                                                break;
                                            }
                                        }
                                        //更新树节点的id
                                        component._updateTreeNodeId(_editingComponent.getId(),newComponent.getId());
                                        parentComponent.suspendEvents(false);//丢弃所有事件
                                        parentComponent.remove(_editingComponent,false);
                                        parentComponent.insert(index,newComponent);
                                        parentComponent.resumeEvents();
                                        //正在编辑的组件
                                        newComponent.addCls('editing');//组件红线(添加到新组件上)
                                        UIDesign.global.GlobalSetting._editingComponent=newComponent;//正在编辑的组件处理(设置为新组件)
                                        //或者这样处理
                                        //delete UIDesign.global.GlobalSetting._editingComponent;//删除window-->正在编辑的组件
                                        //componentConfig.removeAll(true);//清空组件属性面板

                                    }else{//操作的组件不是容器
                                       console.info(_editingComponent);
                                       var map = {};
                                       for(var key in dataMap){
                                           var value = dataMap[key].get('value');
                                           if(Ext.isEmpty(value)){//如果其中一个字段的值为空，则返回
                                             return;
                                           }
                                           map[key]=value;
                                       }
                                       console.info(map);
                                        //进行布局切换操作
                                        var newComponent =component._cloneField(_editingComponent,map);
                                        var parentComponent = _editingComponent.ownerCt;
                                        var index;//组件在父组件中的位置
                                        for(var i =0;i<parentComponent.items.items.length;i++){
                                            if(parentComponent.items.items[i]==_editingComponent){
                                                index = i;
                                                break;
                                            }
                                        }
                                        //更新树节点的id
                                        component._updateTreeNodeId(_editingComponent.getId(),newComponent.getId());
                                        parentComponent.suspendEvents(false);//丢弃所有事件
                                        parentComponent.remove(_editingComponent,false);
                                        parentComponent.insert(index,newComponent);
                                        parentComponent.resumeEvents();
                                        //正在编辑的组件
                                        newComponent.addCls('editing');//组件红线(添加到新组件上)
                                        UIDesign.global.GlobalSetting._editingComponent=newComponent;//正在编辑的组件处理(设置为新组件)
                                        //或者这样处理
                                        //delete UIDesign.global.GlobalSetting._editingComponent;//删除window-->正在编辑的组件
                                        //componentConfig.removeAll(true);//清空组件属性面板




                                    }
                                }

                            }}],
                              source: sourceConfig,
                              sourceConfig:{
                                  labelAlign:{editor:Ext.create('UIDesign.combo.LabelAlignCombobox',{hideLabel:true})}
                              }

                          });






                        }else{

                        }

                        componentConfig.removeAll(true);
                        componentConfig.add(propertyGrid);
                    }

                }else{//找不到组件，则清空组件配置
                    var componentConfig =  component.up('#workBench').down('#componentConfig');
                    componentConfig.removeAll(true);
                }
            });
        });

    },

    /**
     * 根据拖拽的当前位置定位Drop的目标容器
     *
     * @param {*} posX
     * @param {*} posY
     */
    locateChildComponentByPos:function(posX,posY){
        return this.deepFristTraverse(this,function(comp){
            var region = comp.getViewRegion();
            return !region.isOutOfBoundX(posX) && !region.isOutOfBoundY(posY);
        });
    },

    /**
     * 更新树节点的id
     * @param id
     * @param newId
     * @private
     */
    _updateTreeNodeId:function(id,newId){
       var self = this;
       var componentHierarchyTree = self.up('#workBench').down('#componentHierarchyTree');
       var node = componentHierarchyTree.getRootNode().findChild("id", id, true);
       if(node!=null){
          node.setId(newId);
       }
    },

    /**
     * 克隆容器
     * @param component 原组件
     * @param layout    新的布局
     * @private
     */
    _cloneContainer:function(component,layout){
        var items = component.items.items;
        console.info(items);
        var newConponent = component.cloneConfig({layout:layout});
        if(layout!='border'){//如果要切换的布局不是border
            var length = items.length;
            for(var i=0;i<length;i++){
              var item = items[0];
              newConponent.add(item);
            }
            return newConponent;
        }
        var regions=['center','west','east','north','south'];
        var length = items.length;
        for(var i=0;i<length;i++){
            var item = items[0];
            if(i<=4){
                item['region']=regions[i];
            }else{
                item['region']='south';
            }
            newConponent.add(item);
        }
        return newConponent;
    },
    /**
     * 克隆字段
     * @param field 原组件
     * @param config 配置
     * @private
     */
    _cloneField:function(field,config){
        var newConponent = field.cloneConfig(config);
        return newConponent;
    },
    /**
     * 获取容器大小配置
     * @param layout
     * @private
     */
    _getContainerSize:function(layout){
        var sizeConfig = {};
        if(layout=='hbox'){//如果父容器布局为hbox
            sizeConfig['flex']=1;
            sizeConfig['height']=UIDesign.global.GlobalSetting.containerDefaultHeight;
            return sizeConfig;
        }
        if(layout=='vbox'){//如果父容器布局为vbox
            sizeConfig['flex']=1;
            sizeConfig['width']=UIDesign.global.GlobalSetting.containerDefaultWidth;
            return sizeConfig;
        }
        sizeConfig['width']=UIDesign.global.GlobalSetting.containerDefaultWidth;
        sizeConfig['height']=UIDesign.global.GlobalSetting.containerDefaultHeight;
        return sizeConfig;
    },
    /**
     * 根据拖拽的当前位置定位Drop的目标容器
     * 
     * @param {*} posX 
     * @param {*} posY 
     */
    locateDropTargetCtByPos:function(posX,posY){
        return this.deepFristTraverse(this,function(comp){
            var region = comp.getViewRegion();
            return comp.isContainer && !region.isOutOfBoundX(posX) && !region.isOutOfBoundY(posY);
        });
    },

    /**
     * 深度优先遍历设计区中的所有组件，将符合条件的组件作为返回结果返回
     * 
     * @param {*} parentComp 
     * @param {*} predicate 
     */
    deepFristTraverse:function(parentComp,predicate){
        var parentSearchResult = predicate.apply(this,[parentComp]);
        if(!parentSearchResult){
            return;
        }
        if(parentComp.items){
            var items = parentComp.items;
            if(items.getCount){
                var i,childComp;
                for(i=0;i<items.getCount();i++){
                    childComp = items.getAt(i);
                     if(childComp.isContainer){
                        var searchResult = this.deepFristTraverse(childComp,predicate);
                        if(searchResult){
                            return searchResult;
                        }
                     }else{
                         if(predicate.apply(this,[childComp])){
                             return childComp;
                         }
                     }
                }
            }
        }
        if(parentSearchResult){
            return parentComp;
        }
    }
});