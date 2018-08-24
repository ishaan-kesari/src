pimcore.registerNS("pimcore.plugin.toolbar");

pimcore.plugin.toolbar = Class.create({
    /*
    * @constructor
    */
    initialize:function () {
    },
    getClassName: function () {
        return "pimcore.plugin.toolbar";
    },
    addTask: function() {
            Ext.getCmp("pimcore_button_add").disable();
            var panelTitle         = "Add Task";
            var url                = 'admin/save_task';
            var msg                = 'saved';
            var myId = Ext.id();
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
                        value: "",
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
            
           var AddTaskForm = Ext.create('Ext.form.Panel', {
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
                        name: 'subject'
                    },
                    {
                        xtype     : 'textareafield',
                        fieldLabel: t('description'),
                        labelWidth: 120,
                        name      : 'description',
                        grow      : true,
                        anchor    : '100%',
                        allowBlank: false
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
				value: new Date()
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
                                width     : 200
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
                        valueField: 'abbr'
                    },
                    associatedField

                ]
            }); 
            
            var win = new Ext.Window({
                modal:false,
                title:panelTitle,
                width:700,
                height:500,
                plain       : true,
                items  : [AddTaskForm],
                 listeners : {
                    'close': function (){
                        Ext.getCmp("pimcore_button_add").enable();
                    }
                },
                buttons: [
                    {   text: t('save'),
                        handler : function(grid,rowIndex) {
                            var form = AddTaskForm.getForm();
                            //console.log(form.getFieldValues());
                            form.submit({
                                method  : 'POST',
                                url:'../'+url, //for Add
                                success : function() {
                                    Ext.getCmp('mygrid').getStore().load({
                                        params: {
                                            data: JSON.stringify({})
                                        }
                                    });
                                    Ext.Msg.alert('Thank You', 'Your task is '+msg, function() {
                                        AddTaskForm.reset();
                                        win.close();
                                        Ext.getCmp("pimcore_button_add").enable();
                                          
                                    });
                                }
                            });
                        }
                    }
                ]
            });
            win.show();
    },
    deleteSelected: function(data, rowNumber) {
        var grid = data.up('gridpanel');
        var arraySelected =grid.getSelectionModel().getSelection();
        id = []; var i=0;
        arraySelected.map(function(value) {
            id[i] = value['data']['id'];
            i++;
        });

        Ext.Ajax.request({
            url: '../delete_task',
            params: {
                id : Ext.encode(id)
            },
            method: 'GET',  
            success: function(response, opts) {
                Ext.getCmp('mygrid').getStore().load({
                    params: {
                        data: JSON.stringify({})
                    }
                });
                Ext.Msg.alert('Thank You', 'Your task is deleted.',function() {});
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code'+response.status);
            }
        }); 
    },
    completedStatusUpdate : function(data, rowNumber) {
        var grid = data.up('gridpanel');
        var arraySelected = grid.getSelectionModel().getSelection();
        id = []; var i=0;
        arraySelected.map(function(value) {
            id[i] = value['data']['id'];
            i++;
        });

        Ext.Ajax.request({
            url: '../completed_task',
            params: {
                "id": Ext.encode(id)
            },
            method: 'GET',  
            success: function(response, opts) {
                 Ext.getCmp('mygrid').getStore().load({
                    data: JSON.stringify({})
                }); 
                Ext.Msg.alert('Thank You', 'Your task status changed to completed.', function() {});
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code' + response.status);
            }
        }); 
    },
    buttonStates: function() {
        var selectedRows = this.grid.getSelectionModel().getSelection();
        if (selectedRows.length >= 1) {
            Ext.getCmp("pimcore_button_delete").enable();
            Ext.getCmp("pimcore_button_completed").enable();
        } else {
            Ext.getCmp("pimcore_button_delete").disable();
            Ext.getCmp("pimcore_button_completed").disable();
        }
    }
});
