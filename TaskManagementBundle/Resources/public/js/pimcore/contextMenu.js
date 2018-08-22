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
                                        url: '../current_task_detail',
                                        params: {
                                            "id" :record.data.id
                                        },
                                        method: 'GET',  
                                        success: function(response, opts) {
                                            var obj = Ext.decode(response.responseText);
                                            if(obj['success'][0]) {
                                                var taskDetail = obj['success'][0];
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
                                        url: '../delete_task',
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
                                        url: '../current_task_detail',
                                        params: {
                                            "id" :record.data.id
                                        },
                                        method: 'GET',  
                                        success: function(response, opts) {
                                            var obj = Ext.decode(response.responseText);
                                            if(obj['success'][0]) {
                                                var taskDetail = obj['success'][0];
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
            var url = 'update_task';
            var msg = 'updated';
            var description             = taskDetail['description'];
            var dueDate                 = taskDetail['dueDate'].split(" ")[0];
            var dueDateTime             = tConvert(taskDetail['dueDate'].split(" ")[1]);
            var priority                = taskDetail['priority'];
            var status                  = taskDetail['status'];
            var startDate               = taskDetail['startDate'].split(" ")[0];
            var startDateTime           = tConvert(taskDetail['startDate'].split(" ")[1]);
            var completionDate          = taskDetail['completionDate'].split(" ")[0];
            var completionDateTime      = tConvert(taskDetail['completionDate'].split(" ")[1]);
            var associatedElement       = taskDetail['associatedElement'];
            var subject                 = taskDetail['subject'];
            var myId = Ext.id();
            var associatedField =  new Ext.form.FormPanel({
                id: myId,
                type: 'AssociatedElement',
                forceLayout: true,
                style: "margin: 10px 0 0 0",
                bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",

                items: [
                    {
                        xtype: "textfield",
                        fieldLabel: t("associated_element"),
                        name: "associatedElement",
                        width: 500,
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

                                        //if (data.type == "object" || data.type == "variant") {
                                            this.setValue(data.path);
                                            return true;
                                       // }
                                        //return false;
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
                                width     : 100,
                                allowBlank: false,
                                listeners : {
                                    render : function(datefield) {
                                        datefield.setValue(new Date(startDate));
                                    }
                                },
                            },
                            {
                                xtype: 'timefield',
                                name: 'startDateTime',
                                minValue: '12:00 AM',
                                maxValue: '11:45 PM',
                                increment: 15,
                                allowBlank: false,
                                width:100,
                                listeners : {
                                    render : function(datefield) {
                                        datefield.setValue(startDateTime);
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
                                width     : 100,
                                allowBlank: false,
                                listeners : {
                                    render : function(datefield) {
                                        datefield.setValue(new Date(dueDate));
                                    }
                                },
                            },
                            {
                                xtype: 'timefield',
                                name: 'dueDateTime',
                                minValue: '12:00 AM',
                                maxValue: '11:45 PM',
                                allowBlank: false,
                                increment: 15,
                                width:100,
                                listeners : {
                                    render : function(datefield) {
                                        datefield.setValue(dueDateTime);
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
                                width     : 100,
                                listeners : {
                                    render : function(datefield) {
                                        if(completionDate != '0000-00-00')
                                            datefield.setValue(new Date(completionDate));
                                    }
                                },
                            },
                            {
                                xtype: 'timefield',
                                name: 'completionDateTime',
                                minValue: '12:00 AM',
                                maxValue: '11:45 PM',
                                allowBlank: true,
                                increment: 15,
                                width:100,
                                listeners : {
                                    render : function(datefield) {
                                        datefield.setValue(completionDateTime);
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
                        handler : function(grid,rowIndex) {
                            var form = editTaskForm.getForm();
                            form.submit({
                                method  : 'POST',
                                url:'../'+url, //for update 
                                params: {
                                    "id" : taskDetail['id']
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
         * convert 24hrs time to 12hrs
        */
        function tConvert (time) {
            time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
            time= time.slice(0,time.length-1);
            if (time.length > 1) { // If time format correct
              time = time.slice (1);  // Remove full string match value
              time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
              time[0] = +time[0] % 12 || 12; // Adjust hours
            }
            return time.join (''); // return adjusted time or original string
        }
       
       
        /*
         * Open view detail on right click on grid
        */
        function detail(taskDetail) {
            var viewField = Ext.create('Ext.form.Panel', {
                height: 500,
                width: 700,
                bodyPadding: 10,
                defaultType: 'textfield',
                items: [
                    {
                        xtype: 'label',
                        html : "<h4>"+t('subject')+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+taskDetail["subject"]+'</h4>',
                        width:700,
                    },{
                        xtype: 'label',
                        html: "<h4>"+t('description')+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+taskDetail["description"]+'</h4>',
                        width:700
                    },{
                        xtype: 'label',
                        html:"<h4>"+t('start_date')+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+taskDetail["startDate"]+'</h4>',
                        width:700
                    },{
                        xtype: 'label',
                        html: "<h4>"+t('due_date')+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+taskDetail["dueDate"]+'</h4>',
                        width:700,
                    },{
                        xtype: 'label',
                        html: "<h4>"+t('completion_date')+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+taskDetail["completionDate"]+'</h4>',
                        width:700,
                    },{
                        xtype: 'label',
                        html: "<h4>"+t('status')+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+taskDetail["status"]+'</h4>',
                        width:700
                    },{
                        xtype: 'label',
                        html :"<h4>"+ t('priority')+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+taskDetail["priority"]+'</h4>',
                        width:700
                    },{
                        xtype: 'label',
                        html: "<h4>"+ t('associated_element')+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+taskDetail["associatedElement"]+'</h4>',
                        width:700
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
                        handler : function(viewWindow) { viewWindow.close(); }
                    }
                ]
                
            });
            viewWindow.show();
        }
       
                    
    },
    
    
    
});