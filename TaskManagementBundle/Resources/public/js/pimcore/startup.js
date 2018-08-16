pimcore.registerNS("pimcore.plugin.TaskManagementBundle");

pimcore.plugin.TaskManagementBundle = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.TaskManagementBundle";
    },
    initialize: function (config) {
        
        this.config = {
            searchParams: {},
        };
        Ext.apply(this.config, config);
        this.searchParams = this.config.searchParams;
        pimcore.plugin.broker.registerPlugin(this);
    },
    pimcoreReady: function (params, broker) {
        // var taskManagmentExtFile1 = new pimcore.plugin.taskManagmentExtFile();
        //taskManagmentExtFile1.addMenuIntools(this);
        this.addMenuIntools(this);
    },
     
    addMenuIntools: function (scope) {
        var user = pimcore.globalmanager.get("user");
        if (user.admin == true ) {
            var toolbar = pimcore.globalmanager.get("layout_toolbar");
            var action = new Ext.Action({
                id: "task_management_menu",
                text: t("task_management"),
                iconCls:"task_management_icon pimcore_menu_mds pimcore_menu_item pimcore_menu_needs_hildren",
                handler: function() { scope.showTab(); },
            });
            toolbar.extrasMenu.add(action);
            pimcore.helpers.initMenuTooltips();
        } else {
            return false;
        }
    },
    showTab: function() {
         this.fromDate = new Ext.form.DateField({
                name: 'start_date',
                width: 120,
                xtype: 'datefield'
            });

            this.fromTime = new Ext.form.TimeField({
                name: 'start_time',
                width: 80,
                xtype: 'timefield'
            });

            this.toDate = new Ext.form.DateField({
                name: 'due_date',
                width: 120,
                xtype: 'datefield'
            });

            this.toTime = new Ext.form.TimeField({
                name: 'due_time',
                width: 80,
                xtype: 'timefield'
            });

            var formSearch = this.find.bind(this);
            this.searchpanel = new Ext.FormPanel({
                region: "east",
                title: t("task_search_form"),
                width: 350,
                height: 500,
                border: false,
                autoScroll: true,
                referenceHolder: true,
                margin:20,
                collapsible: true,
                collapsed: true,
                collapseDirection: 'left',
                bodyPadding: 3,
                defaultButton: 'task_search_button',
                buttons: [{
                    text: t("reset_search"),
                    handler: this.clearValues.bind(this),
                    iconCls: "pimcore_icon_stop"
                },{
                    reference: 'log_search_button',
                    text: t("search"),
                    handler: this.find.bind(this),
                    iconCls: "pimcore_icon_search"
                }],
                listeners: {
                    afterRender: function(formCmp) {
                        this.keyNav = Ext.create('Ext.util.KeyNav', formCmp.el, {
                            enter: formSearch,
                            scope: this
                        });
                    }
                },
                
                items: [ {
                    xtype:'fieldset',
                    autoHeight:true,
                    labelWidth: 120,
                    items :[
                        {
                            xtype:'textfield',
                            name: 'search',
                            fieldLabel: t('search'),
                            width: 305,
                            listWidth: 150
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldLabel: t('start_date'),
                            combineErrors: true,
                            name: 'start_date',
                            items: [this.fromDate, this.fromTime]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldLabel: t('due_date'),
                            combineErrors: true,
                            name: 'due_date',
                            items: [this.toDate, this.toTime]
                        },{
                            xtype:'combo',
                            name: 'priority',
                            fieldLabel: t('priority'),
                            width: 305,
                            listWidth: 150,
                            mode: 'local',
                            typeAhead:true,
                            forceSelection: true,
                            triggerAction: 'all',
                            store: this.priorityStore,
                            displayField: 'value',
                            valueField: 'key'
                        },{
                            xtype:'combo',
                            name: 'staus',
                            fieldLabel: t('status'),
                            width: 305,
                            listWidth: 150,
                            mode: 'local',
                            typeAhead:true,
                            forceSelection: true,
                            triggerAction: 'all',
                            store: this.componentStore,
                            displayField: 'value',
                            valueField: 'key'
                        }]
                }]});
        
        
        if (!this.panel) {
            this.panel = new Ext.Panel({
                id:         "task_manager_panel",
                title:      t("task_manager"),
                border:     false,
                layout:     "fit",
                closable:   true,
            });
             
            var layout = new Ext.Panel({
                border: false,
                layout: "border",
                items: [this.searchpanel, this.getGrid()],
            });
             
            this.panel.add(layout);
            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("task_manager_panel");

            this.panel.on("destroy", function () {
                pimcore.globalmanager.remove("task_manager_panel");
                this.panel = undefined;
            }.bind(this));
            
            pimcore.layout.refresh();
        } 
    
        return this.panel;
    },
    clearValues: function(){
        this.searchpanel.getForm().reset();
        this.searchParams.fromDate = null;
        this.searchParams.fromTime = null;
        this.searchParams.toDate = null;
        this.searchParams.toTime = null;
        this.searchParams.priority = null;
        this.searchParams.status = null;
        this.searchParams.subject = null;
        this.store.baseParams = this.searchParams;
        this.store.reload({
            params:this.searchParams
        });
    },
    find: function() {
        var formValues = this.searchpanel.getForm().getFieldValues();
        this.searchParams.fromDate = this.fromDate.getValue();
        this.searchParams.fromTime = this.fromTime.getValue();
        this.searchParams.toDate = this.toDate.getValue();
        this.searchParams.toTime = this.toTime.getValue();
        this.searchParams.priority = formValues.priority;
        this.searchParams.status = formValues.status;
        this.searchParams.subject = formValues.subject;
 
        var proxy = this.store.getProxy();
        proxy.extraParams = this.searchParams;
        this.pagingToolbar.moveFirst();
    },
    getGrid: function () {
        
        this.filterField = new Ext.form.TextField({
            xtype: "textfield",
            width: 200,
            style: "margin: 0 10px 0 0;",
            enableKeyEvents: true,
            listeners: {
                "keydown": function (field, key) {
                    if (key.getKey() == key.ENTER) {
                        var input = field;
                        var proxy = this.store.getProxy();
                        proxy.extraParams.filterFullText = input.getValue();
                        this.store.load();
                    }
                }.bind(this)
            }
        });
        var typesColumns = [
            {text: t("subject"), width: 50, sortable: true, dataIndex: 'subject'},
            {text: t("description"), flex: 200, sortable: true, dataIndex: 'description', filter: 'string'},
            {text: t("due_date"), flex: 140, sortable: true, dataIndex: 'dueDate' },
            {text: t("priority"), flex: 60, sortable: true, dataIndex: 'priority'},
            {text: t("status"), flex: 60, sortable: true, dataIndex: 'status'},
            {text: t("start_date"), flex: 80, sortable: true, dataIndex: 'startDate'},
            {text: t("completion_date"), flex: 80, sortable: true, dataIndex: 'completionDate'},
            {text: t("associated_element"), flex: 80, sortable: true, dataIndex: 'associatedElement'}
        ];
        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'main-toolbar',
            items: [
                {
                    text: t('add_task'),
                    handler:this.addTask.bind(this),
                    icon: "/pimcore/static6/img/flat-color-icons/add_row.svg",
                    id: "pimcore_button_add",
                    disabled: false
                }, '-', {
                    text: t('delete_selected'),
                    handler: this.deleteSelected.bind(this),
                    iconCls: "pimcore_icon_delete",
                    id: "pimcore_button_delete",
                    disabled: true
                }, 
                {
                    text: t('completed'),
                    handler: this.completedStatusUpdate.bind(this),
                    iconCls: "task_completed_icon",
                    id: "pimcore_button_completed",
                    disabled: true
                }                
              
            ]
        });
             
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
                                allowBlank: false,
                                width     : 100,
                                listeners : {
                                    render : function(datefield) {
                                        datefield.setValue(new Date(completionDate));
                                    }
                                },
                            },
                            {
                                xtype: 'timefield',
                                name: 'completionDateTime',
                                minValue: '12:00 AM',
                                maxValue: '11:45 PM',
                                allowBlank: false,
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
                    {   xtype: 'textfield',
                        labelWidth: 120,
                        allowBlank: false,
                        fieldLabel: t('associated_element'),
                        name: 'associatedElement',
                        width:327,
                        value:associatedElement
                    }
                ]
            }); 
            
            var win = new Ext.Window({
                modal:true,
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
        
        this.selectionColumn = new Ext.selection.CheckboxModel();
        this.selectionColumn.on("selectionchange", this.buttonStates.bind(this));
        this.store = new Ext.data.JsonStore({
            totalProperty: 'total',
            pageSize: 10,
            proxy: {
                url: '../show_task_listing',
                type: 'ajax',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            fields:  [
                'id', 'subject', 'description', 'dueDate', 'priority', 'status', 'startDate', 'completionDate', 'associatedElement'
            ],
            baseParams:{
                showOpt: 1,
            },
            listeners: {
                beforeload: function (store) {
                    this.store.getProxy().extraParams.limit = this.pagingtoolbar.pageSize;
                    this.store.getProxy().extraParams.start = 0;
                }.bind(this)            
            }
        });
        
        this.pagingtoolbar = new Ext.PagingToolbar({
            pageSize: 10,
            store: this.store,
            displayInfo: true,
            displayMsg: '{0} - {1} /  {2}',
            emptyMsg: 'No item found'
        });

        this.pagingtoolbar.add("-");
        this.pagingtoolbar.add(new Ext.Toolbar.TextItem({
            text: t("items_per_page")
        }));
        this.pagingtoolbar.add(new Ext.form.ComboBox({
            store: [
                [1, "1"],
                [2, "2"],
                [40, "40"],
                [60, "60"],
                [80, "80"],
                [100, "100"]
            ],
            queryMode: "local",
            width: 100,
            value: 10,
            triggerAction: "all",
            listeners: {
                select: function(box, rec, index) {
                    this.pagingtoolbar.pageSize = intval(rec.data.field1);
                    this.store.pageSize = intval(rec.data.field1);
                    this.pagingtoolbar.moveFirst();
                }.bind(this)
            }
        }));
        
        this.grid = new Ext.grid.GridPanel({
            frame: false,
            autoScroll: true,
            store: this.store,
            columnLines: true,
            bbar: this.pagingtoolbar,
            stripeRows: true,
            selModel: this.selectionColumn,
            plugins: ['pimcore.gridfilters'],
            title: t("task_manager"),
            trackMouseOver:false,
            region: "center",
            columns: typesColumns,
            tbar: toolbar,
            id:'mygrid',
            listeners: {
                itemcontextmenu: function(grid, record, item, rowIndex, e, eOpts) {
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
                }
            },
            
             viewConfig: {
                enableRowBody: true,
                showPreview: true,
            },
        });

        this.store.load();
        return this.grid;
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
    addTask: function() {
              var use = 'Add';   
              var taskDetail =[];
        
            //'use' will be Add or Edit, 'taskDetail' will be empty for add and filled for edit
            if(use == 'Add') {
                var panelTitle         = "Add Task";
                var url                = 'save_task';
                var msg                = 'saved';
                var description        = '';
                var dueDate            = '';
                var priority           = '';
                var status             = '';
                var startDate          = '';
                var completionDate     = '';
                var associatedElement  = '';
            } else if(use == 'Edit') {
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
            }   
            
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
                                        if(use == 'Edit')
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
                                        if(use == 'Edit')
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
                                        if(use == 'Edit')
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
                                        if(use == 'Edit')
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
                                allowBlank: false,
                                width     : 100,
                                listeners : {
                                    render : function(datefield) {
                                        if(use == 'Edit')
                                            datefield.setValue(new Date(completionDate));
                                    }
                                },
                            },
                            {
                                xtype: 'timefield',
                                name: 'completionDateTime',
                                minValue: '12:00 AM',
                                maxValue: '11:45 PM',
                                allowBlank: false,
                                increment: 15,
                                width:100,
                                listeners : {
                                    render : function(datefield) {
                                        if(use == 'Edit')
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
                    {   xtype: 'textfield',
                        labelWidth: 120,
                        allowBlank: false,
                        fieldLabel: t('associated_element'),
                        name: 'associatedElement',
                        width:327,
                        value:associatedElement
                    }
                ]
            }); 
            
            var win = new Ext.Window({
                modal:true,
                title:panelTitle,
                width:700,
                height:500,
                closeAction :'hide',
                plain       : true,
                items  : [AddTaskForm],
                buttons: [
                    {   text: t('save'),
                        handler : function(grid,rowIndex) {
                            var form = AddTaskForm.getForm();
                            form.submit({
                                method  : 'POST',
                                url:'../'+url, //for update & add
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
                                        AddTaskForm.reset();
                                        win.close();
                                          
                                    });
                                }
                            });
                        }
                    }
                ]
            });
            win.show();
            
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
    }
    
});

var taskManagementBundlePlugin = new pimcore.plugin.TaskManagementBundle();
