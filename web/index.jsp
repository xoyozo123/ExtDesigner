<%--
  Created by IntelliJ IDEA.
  User: taisong.zhang
  Date: 2018/11/8
  Time: 上午 11:15
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  String contextPath = request.getContextPath();
%>
<html>
  <head>
    <title>Extjs Designer</title>
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/js/ext4/resources/css/ext-all.css">
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/design.css">
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/icon.css">
    <script type="text/javascript"  src="<%=contextPath%>/js/ext4/bootstrap.js"></script>
    <script type="text/javascript"  src="<%=contextPath%>/js/ext4/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript">
        Ext.Loader.setConfig({
            enabled: true,
            paths: {
                'UIDesign': './js/UIDesign'
            }
        });

        Ext.onReady(function(){
            Ext.create('UIDesign.WorkBench',{
                renderTo:'workBench',
                width:'100%',
                height:'100%'
            });
        });


    </script>
  </head>
  <body>
  <div id="workBench">

  </div>
  </body>
</html>
