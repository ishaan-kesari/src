pimcore.registerNS("pimcore.plugin.contextMenu");

pimcore.plugin.contextMenu = Class.create({
    
    /*
    * @constructor
    */
    initialize:function(){},
    
    getClassName: function () {
        return "pimcore.plugin.contextMenu";
    },
    start:function (grid, record, item, rowIndex, e, eOpts) {
        
        var menu_grid = new Ext.menu.Menu({
                        items:[
                            { 
                                text: t('edit'),
                                icon: '/pimcore/static6/img/flat-color-icons/edit.svg',
                                handler: function (grid, rowIndex) {
                                    Ext.Ajax.request({
                                        url: 'tasks/current-task-detail',
                                        params: {
                                            "id" :record.data.id
                                        },
                                        method: 'GET',  
                                        success: function(response, opts) {
                                            var obj = Ext.decode(response.responseText);
                                            if(obj['data'][0]) {
                                                var taskDetail = obj['data'][0];
                                                editTaskFormFn(taskDetail);
                                            }
                                        },
                                        failure: function(response, opts) {
                                            console.log('server-side failure with status code' + response.status);
                                        }
                                    });    
                                }.bind(this)
                            },
                            { 
                                text: t('delete'),
                                icon: '/pimcore/static6/img/flat-color-icons/delete.svg',
                                handler:function () {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    Ext.Ajax.request({
                                        url: 'tasks/delete',
                                        params: {
                                            "id" : Ext.encode([rec.getId()])
                                        },
                                        method: 'GET',
                                        success: function(response, opts) {
                                            grid.getStore().removeAt(rowIndex);
                                        },

                                        failure: function(response, opts) {
                                            console.log('server-side failure with status code ' + response.status);
                                        }
                                    })
                                }
                            },
                            { 
                                text: t('view'),
                                icon: '/pimcore/static6/img/flat-color-icons/view_details.svg',
                                handler: function (data,rowIndex) {
                                    Ext.Ajax.request({
                                        url: 'tasks/current-task-detail',
                                        params: {
                                            "id" :record.data.id
                                        },
                                        method: 'GET',  
                                        success: function(response, opts) {
                                            var obj = Ext.decode(response.responseText);
                                            console.log(obj);
                                            
                                            if(obj['data'][0]) {
                                                var taskDetail = obj['data'][0];
                                                detail(taskDetail);
                                            }
                                        },
                                        failure: function(response, opts) {
                                            console.log('server-side failure with status code' + response.status);
                                        }
                                    });
                                }
                            }
                        ]
                    });
        var position = [e.getX()-10, e.getY()-10];
        e.stopEvent();
        menu_grid.showAt(position);
        
        /*
         * Add Task Form OR Edit Task Form
         * 
         */
        function editTaskFormFn(taskDetail) {
            var panelTitle = "Edit Task";
            var url = 'tasks/save';
            var msg = t('updated');
            var description             = taskDetail['description'];
            var dueDate                 = taskDetail['dueDate'].split(" ")[0];
            var priority                = taskDetail['priority'];
            var status                  = taskDetail['status'];
            var startDate               = taskDetail['startDate'].split(" ")[0];
            var completionDate          = taskDetail['completionDate'].split(" ")[0];
            var associatedElement       = taskDetail['associatedElement'];
            var subject                 = taskDetail['subject'];
            var myId = Ext.id();
            // Associated field text field with drag and drap
            //  Object, Assets and documents
            var associatedField =  new Ext.form.FormPanel({
                id: myId,
                type: 'AssociatedElement',
                forceLayout: true,
                items: [
                    {
                        xtype: "textfield",
                        fieldLabel: t("associated_element"),
                        name: "associatedElement",
                        anchor    : '100%',
                        labelWidth: 120,
                        cls: "input_drop_target",
                        value: associatedElement,
                        listeners: {
                            "render": function (el) {
                                new Ext.dd.DropZone(el.getEl(), {
                                    reference: this,
                                    ddGroup: "element",
                                    getTargetFromEvent: function(e) {
                                        return this.getEl();
                                    }.bind(el),

                                    onNodeOver : function(target, dd, e, data) {
                                        return Ext.dd.DropZone.prototype.dropAllowed;
                                    },
                                    onNodeDrop : function (target, dd, e, data) {
                                        var record = data.records[0];
                                        var data = record.data;
                                            this.setValue(data.path);
                                            return true;
                                    }.bind(el)
                                });
                            }
                        }
                    }
                ]
            });
            
            var editTaskForm = Ext.create('Ext.form.Panel', {
                renderTo: document.body,
                height: 500,
                width: 700,
                bodyPadding: 10,
                defaultType: 'textfield',
                items: [
                    {   
                        xtype: 'textfield',
                        fieldLabel: t('subject'),
                        allowBlank: false,
                        labelWidth: 120,
                        width:327,
                        name: 'subject',
                        value:subject
                    },
                    {
                        xtype     : 'textareafield',
                        fieldLabel: t('description'),
                        labelWidth: 120,
                        name      : 'description',
                        grow      : true,
                        anchor    : '100%',
                        allowBlank: false,
                        value     : description
                    },{   
                        xtype: 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel: t('start_date'),
                        labelWidth: 120,
                        items:[
                            {
                                xtype     : 'datefield',
                                name      : 'startDate',
                                width     : 200,
                                allowBlank: false,
                                listeners : {
                                    render : function(datefield) {
                                        datefield.setValue(new Date(startDate));
                                    }
                                },
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout : 'hbox',
                        labelWidth: 120,
                        fieldLabel: t('due_date'),
                        items:[
                            {
                                xtype     : 'datefield',
                                name      : 'dueDate',
                                width     : 200,
                                allowBlank: false,
                                listeners : {
                                    render : function(datefield) {
                                        datefield.setValue(new Date(dueDate));
                                    }
                                },
                            }
                        ]
                    },
                    {   
                        xtype: 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel: t('completion_date'),
                        labelWidth: 120,
                            items:[
                            {
                                xtype     : 'datefield',
                                name      : 'completionDate',
                                allowBlank: true,
                                width     : 200,
                                listeners : {
                                    render : function(datefield) {
                                        if(completionDate != '0000-00-00')
                                            datefield.setValue(new Date(completionDate));
                                    }
                                },
                            }
                        ]
                    },
                    {   xtype: 'combo',
                        fieldLabel: t('status'),
                        allowBlank: false,
                        labelWidth: 120,
                        name: 'status',
                        width:327,
                        store: [
                            ['Not started', 'Not started'],
                            ['In Progress', 'In Progress'],
                            ['Completed', 'Completed']
                        ],
                        fields: ['value', 'text'],
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'abbr',
                        value:status
                    },
                    
                    {
                        xtype: 'combo',
                        labelWidth: 120,
                        allowBlank: false,
                        fieldLabel: t('priority'),
                        name: 'priority',
                        width:327,
                        store: [
                            ['High', 'High'],
                            ['Normal', 'Normal'],
                            ['Low', 'Low']
                        ],
                        fields: ['value', 'text'],
                        queryMode: 'local',
                        displayField: 'name',
                        allowBlank: false,
                        valueField: 'abbr',
                        value:priority
                    },
                    associatedField
                ]
            }); 
            
            var win = new Ext.Window({
                modal:false,
                title:panelTitle,
                width:700,
                height:500,
                closeAction :'hide',
                plain       : true,
                items  : [editTaskForm],
                buttons: [
                    {   text: t('save'),
                        iconCls: "pimcore_icon_save",
                        handler : function(grid,rowIndex) {
                            var form = editTaskForm.getForm();
                            form.submit({
                                method  : 'POST',
                                url:url, //for update
                                params: {
                                    "id" : taskDetail['id'],
                                    "edit": true
                                },
                                success : function() {
                                    Ext.getCmp('mygrid').getStore().load({
                                        params: {
                                            data: JSON.stringify({})
                                        }
                                    });
                                    Ext.Msg.alert('Thank You', 'Your task is '+msg, function() {
                                        editTaskForm.reset();
                                        win.close();
                                          
                                    });
                                }
                            });
                        }
                    }
                ]
            });
            win.show();
        }
        
       
        /*
         * Open view details on right click of grid rows
        */
        function detail(taskDetail) {
            
            var  viewField =  Ext.create('Ext.Container', {
                    fullscreen: false,
                    style: "padding-left:30px",
                    layout: 'vbox',
                    items: [
                        {   layout: 'hbox',
                            items:[
                                {
                                    html: "<h4>"+t('subject')+':</h4>',
                                    flex: 1,
                                    width:200
                                },
                                {
                                    html: '<h4>'+taskDetail["subject"]+'</h4>',
                                    flex: 2,
                                }
                            ]
                        },{ 
                            layout: 'hbox',
                            items:[
                                {
                                    html: "<h4>"+t('description')+':</h4>',
                                    flex: 1,
                                    width:200
                                },
                                {
                                    html: '<h4>'+taskDetail["description"]+'</h4>',
                                    flex: 2
                                }
                            ]
                        },{ 
                            layout: 'hbox',
                            items:[
                                {
                                    html: "<h4>"+t('start_date')+':</h4>',
                                    flex: 1,
                                    width:200
                                },
                                {
                                    html: '<h4>'+taskDetail["startDate"]+'</h4>',
                                    flex: 2
                                }
                            ]
                        },{ 
                            layout: 'hbox',
                            items:[
                                {
                                    html: "<h4>"+t('due_date')+':</h4>',
                                    flex: 1,
                                    width:200
                                },
                                {
                                    html: '<h4>'+taskDetail["dueDate"]+'</h4>',
                                    flex: 2
                                }
                            ]
                        },{ 
                            layout: 'hbox',
                            items:[
                                {
                                    html: "<h4>"+t('completion_date')+':</h4>',
                                    flex: 1,
                                    width:200
                                },
                                {
                                    html: '<h4>'+taskDetail["completionDate"]+'</h4>',
                                    flex: 2
                                }
                            ]
                        },{ 
                            layout: 'hbox',
                            items:[
                                {
                                    html: "<h4>"+t('status')+':</h4>',
                                    flex: 1,
                                    width:200
                                },
                                {
                                    html: '<h4>'+taskDetail["status"]+'</h4>',
                                    flex: 2
                                }
                            ]
                        },{ 
                            layout: 'hbox',
                            items:[
                                {
                                    html: "<h4>"+t('priority')+':</h4>',
                                    flex: 1,
                                    width:200
                                },
                                {
                                    html: '<h4>'+taskDetail["priority"]+'</h4>',
                                    flex: 2
                                }
                            ]
                        },{ 
                            layout: 'hbox',
                            items:[
                                {
                                    html: "<h4>"+t('associated_element')+':</h4>',
                                    flex: 1,
                                    width:200
                                },
                                {
                                    html: '<h4>'+taskDetail["associatedElement"]+'</h4>',
                                    flex: 2
                                }
                            ]
                        }
                    ]
                });
                
            
            var viewWindow = new Ext.Window({
                modal:true,
                title:"View Detail",
                width:700,
                height:500,
                closeAction :'hide',
                plain       : true,
                items  : [viewField],
                buttons: [
                    {   text: t('close'),
                        handler : function() { viewWindow.close(); }
                    }
                ]
                
            });
            viewWindow.show();
        }
       
                    
    }
    
    
    
});