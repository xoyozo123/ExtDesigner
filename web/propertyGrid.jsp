<%--
  Created by IntelliJ IDEA.
  User: taisong.zhang
  Date: 2018/11/12
  Time: 下午 06:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String contextPath = request.getContextPath();
%>
<html>
<head>
    <title>属性网格</title>
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/js/ext4/resources/css/ext-all.css">
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/icon.css">
    <script type="text/javascript"  src="<%=contextPath%>/js/ext4/bootstrap.js"></script>
    <script type="text/javascript"  src="<%=contextPath%>/js/ext4/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript">
      Ext.onReady(function(){
          Ext.create('Ext.grid.property.Grid', {
              title: 'Properties Grid',
              tbar:[{xtype: 'button', text: '保存',iconCls:'icon-save',handler:function(button,eventObject){
                  console.info('点击了保存~~~');
                  var propertyGrid = button.up('propertygrid');
                  var gridStore = propertyGrid.getStore();
                  var dataMap = gridStore.data.map;
                  var Created = dataMap['Created'].get('value')
                  //var Created= gridStore.getById("Created").get("value");
                  console.info(Created);


                  //dataMap['Version'].set('value','0.06')
                  //gridStore.getById("Version").set('value','0.09');



              }}],

              width: 300,
              renderTo: Ext.getBody(),
              source: {
                  "(name)": "My Object",
                  "Created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
                  "Available": false,
                  "Version": 0.01,
                  "Description": "A test object",
                  "age":null,
                  "workingTime":null
              },
              sourceConfig:{
                  Created: {
                      displayName: 'Created Date~~~'
                  },
                  Available:{
                      renderer:function(value){
                        if(value==true){
                            return "<font color='green'>"+value+"</font>";
                        }
                        return '<font color="red">'+value+'</font>';
                      }
                  },
                  age:{
                      type:'number'
                  },
                  workingTime:{
                      editor:Ext.create('Ext.form.field.Time',{
                          selectOnFocus:true
                      })
                  }
              }
          });



      });



    </script>
</head>
<body>

</body>
</html>
