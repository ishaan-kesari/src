pimcore.registerNS("pimcore.plugin.TaskManagementBundle");

pimcore.plugin.TaskManagementBundle = Class.create(pimcore.plugin.admin, {
    
    
    getClassName: function () {
        return "pimcore.plugin.TaskManagementBundle";
    },

    initialize: function (config) {
        this.config = {
            searchParams: {},
            //refreshInterval: 5
        };

        Ext.apply(this.config, config);
        this.searchParams = this.config.searchParams;
        pimcore.plugin.broker.registerPlugin(this);
    },

    pimcoreReady: function (params, broker) {
       //alert("TaskManagementBundle ready!");
       this.addMenuIntools(this);
       /*
        scope.on("destroy", function () {
            pimcore.globalmanager.remove("task_manegment_menu");
        }.bind(this));

        pimcore.layout.refresh(); */
    },
    addMenuIntools: function (scope) {
        var user = pimcore.globalmanager.get("user");
        if (user.admin == true ) {
            var toolbar = pimcore.globalmanager.get("layout_toolbar");
            var action = new Ext.Action({
                id: "task_management_menu",
                text: "Task Management",
                iconCls:"task_management_icon pimcore_menu_mds pimcore_menu_item pimcore_menu_needs_hildren",
                handler: function() { scope.showTab(); },
            });
            toolbar.extrasMenu.add(action);
            pimcore.helpers.initMenuTooltips();
        } else {
            return false;
        }

/*var user = pimcore.globalmanager.get("user");
var perspectiveCfg = pimcore.globalmanager.get("perspective");
if (perspectiveCfg.inToolbar("extras")) {

            var extrasItems = [];

            if (user.isAllowed("taskmanagement") && perspectiveCfg.inToolbar("extras.taskmanagement")) {
                extrasItems.push({
                    text: t("taskmanagement"),
                    iconCls: "pimcore_icon_glossary",
                    handler: ""
                });
               
            }
            
            if (extrasItems.length > 0) {
                this.extrasMenu = new Ext.menu.Menu({
                    items: extrasItems,
                    shadow: false,
                    cls: "pimcore_navigation_flyout"
                });
               
            }
            if (this.extrasMenu) {
                var toolbar = pimcore.globalmanager.get("layout_toolbar");
                Ext.get("pimcore_menu_extras").on("mousedown", toolbar.showSubMenu.bind(this.extrasMenu));
        }
    }*/
     
    },
     /*showSubMenus: function (e) {
        if(this.hidden) {
            e.stopEvent();
            var el = Ext.get(e.currentTarget);
            var offsets = el.getOffsetsTo(Ext.getBody());
            offsets[0] = 60;
            this.showAt(offsets);
        } else {
            this.hide();
        }
    },*/
    
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
                title: t("Task Search Form"),
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
                    text: t("Reset Search"),
                    handler: this.clearValues.bind(this),
                    iconCls: "pimcore_icon_stop"
                },{
                    reference: 'log_search_button',
                    text: t("Search"),
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
                            fieldLabel: t('Search'),
                            width: 320,
                            listWidth: 150
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldLabel: t('Start Date'),
                            combineErrors: true,
                            name: 'start_date',
                            items: [this.fromDate, this.fromTime]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldLabel: t('Due Date'),
                            combineErrors: true,
                            name: 'due_date',
                            items: [this.toDate, this.toTime]
                        },{
                            xtype:'combo',
                            name: 'priority',
                            fieldLabel: t('Priority'),
                            width: 320,
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
                            fieldLabel: t('Staus'),
                            width: 320,
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
                 title:      "Task Manager",
                 border:     false,
                 layout:     "fit",
                 closable:   true,
                // items:      [this.getGrid()]
            });
             
            var layout = new Ext.Panel({
                border: false,
                layout: "border",
                items: [this.searchpanel, this.getGrid() ],
            });
             
            this.panel.add(layout);
            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("task_manager_panel");

            this.panel.on("destroy", function () {
                pimcore.globalmanager.remove("task_manager_panel");
            }.bind(this));
            
            pimcore.layout.refresh();
        }
    
        return this.panel;
        /* try {
            pimcore.globalmanager.get("pimcore_task_management").activate();
        }
        catch (e) {
            var taskManager = new pimcore.plugin.taskmanager();
            pimcore.globalmanager.add("pimcore_task_management", taskManager.getTabPanel());
        }*/
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
        var ryc = pimcore.globalmanager.get("layout_toolbar");
        var itemsPerPage = pimcore.helpers.grid.getDefaultPageSize();


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

        //this.pagingtoolbar = pimcore.helpers.grid.buildDefaultPagingToolbar(this.store);

        var typesColumns = [
            {
                text: t("Subject"), width: 50, sortable: true, dataIndex: 'subject'
            },
            {text: t("Description"), flex: 200, sortable: true, dataIndex: 'description', filter: 'string'},
            {
                text: t("Due date"), flex: 140, sortable: true, dataIndex: 'due_date',
//                renderer: function (d) {
//                    var date = new Date(d * 1000);
//                    return Ext.Date.format(date, "Y-m-d H:i:s");
//                },
//                filter: 'date'

            },
            {text: t("Priority"), flex: 60, sortable: true, dataIndex: 'priority'},
            {text: t("Status"), flex: 60, sortable: true, dataIndex: 'status'},
            {text: t("Start date"), flex: 80, sortable: true, dataIndex: 'start_date'},
            {text: t("Completion date"), flex: 80, sortable: true, dataIndex: 'completion_date'},
            {text: t("Associated Element"), flex: 80, sortable: true, dataIndex: 'associated_element'},
            {
                xtype: 'actioncolumn',
                menuText: t('delete'),
                text: t("Delete"),
                width: 30,
                items: [{
                    tooltip: t('delete'),
                    icon: "/pimcore/static6/img/flat-color-icons/delete.svg",
                    handler: function (grid, rowIndex) {
                        console.log(grid);
                        console.log(rowIndex);
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
                    }.bind(this)
                }]
            }
        ];
        
        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'main-toolbar',
            items: [
                {
                    text: t('Add Task'),
                    handler: function() {
                       AddEditTaskForm('Add',[]);
                    },
                    icon: "/pimcore/static6/img/flat-color-icons/add_row.svg",
                    id: "pimcore_button_add",
                    disabled: false
                }, '-', {
                    text: t('Delete Selected'),
                    handler: this.deleteSelected.bind(this),
                    iconCls: "pimcore_icon_delete",
                    id: "pimcore_button_delete",
                    disabled: true
                }, 
                {
                    text: t('Completed'),
                    handler: this.completedStatusUpdate.bind(this),
                    iconCls: "task_completed_icon",
                    //icon:"../../../../static6/images/task_completed.svg",
                    //icon: "/pimcore/static6/img/flat-color-icons/task_completed.svg",
                    id: "pimcore_button_completed",
                    disabled: true
                },
                '->', {
                    text: t("filter") + "/" + t("search"),
                    xtype: "tbtext",
                    style: "margin: 0 10px 0 0;"
                },
                this.filterField
            ]
        });
             
             
        function tConvert (time) {
            // Check correct time format and split into components
            time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
            time= time.slice(0,time.length-1);

            if (time.length > 1) { // If time format correct
              time = time.slice (1);  // Remove full string match value
              time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
              time[0] = +time[0] % 12 || 12; // Adjust hours
            }
            return time.join (''); // return adjusted time or original string
        }
       
        function AddEditTaskForm(Use,taskDetail) {
            if(Use == 'Add') {
                var panelTitle         = "Add Task";
                var url                = 'save_task';
                var msg                = 'Saved';
                var description = due_date = priority = status =
                    start_date = completion_date = associated_element = '';
                
            } else if(Use == 'Edit') {
                var panelTitle = "Edit Task";
                var url = 'update_task';
                var msg = 'Updated';
                var description             = taskDetail['description'];
                var due_date                = taskDetail['due_date'].split(" ")[0];
                var due_date_time           = tConvert(taskDetail['due_date'].split(" ")[1]);
                var priority                = taskDetail['priority'];
                var status                  = taskDetail['status'];
                var start_date              = taskDetail['start_date'].split(" ")[0];
                var start_date_time         = tConvert(taskDetail['start_date'].split(" ")[1]);
                var completion_date         = taskDetail['completion_date'].split(" ")[0];
                var completion_date_time    = tConvert(taskDetail['completion_date'].split(" ")[1]);
                var associated_element      = taskDetail['associated_element'];
                var subject                 = taskDetail['subject'];
            }   
            
            
            var AssociationFeilds = Ext.define('MyModel', {
                    extend: 'Ext.data.Model',
                    fields: [
                        {
                            name: 'id'
                        },
                        {
                            name: 'relationId',
                            reference: 'Relation',
                            unique: true
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
                        fieldLabel: t('Subject'),
                        labelWidth: 120,
                        width:305,
                        name: 'subject',
                        value:subject
                    },
                    {
                        xtype     : 'textareafield',
                        fieldLabel: 'Description',
                        labelWidth: 120,
                        name      : 'description',
                        grow      : true,
                        anchor    : '100%',
                        allowBlank: false,
                        value     : description
                    },{   
                        xtype: 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel: t('Start Date'),
                        labelWidth: 120,
                        items:[
                            {
                                xtype     : 'datefield',
                                name      : 'start_date',
                                width     : 100,
                                listeners : {
                                    render : function(datefield) {
                                        if(Use == 'Edit')
                                            datefield.setValue(new Date(start_date));
                                    }
                                },
                            },
                            {
                                xtype: 'timefield',
                                name: 'start_date_time',
                                minValue: '12:00 AM',
                                maxValue: '11:45 PM',
                                increment: 15,
                                width:100,
                                listeners : {
                                    render : function(datefield) {
                                        if(Use == 'Edit')
                                            datefield.setValue(start_date_time);
                                    }
                                },
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout : 'hbox',
                        labelWidth: 120,
                        fieldLabel: t('Due Date'),
                        items:[
                            {
                                xtype     : 'datefield',
                                name      : 'due_date',
                                width     : 100,
                                listeners : {
                                    render : function(datefield) {
                                        if(Use == 'Edit')
                                            datefield.setValue(new Date(due_date));
                                    }
                                },
                            },
                            {
                                xtype: 'timefield',
                                name: 'due_date_time',
                                minValue: '12:00 AM',
                                maxValue: '11:45 PM',
                                increment: 15,
                                width:100,
                                listeners : {
                                    render : function(datefield) {
                                        if(Use == 'Edit')
                                            datefield.setValue(due_date_time);
                                    }
                                },
                            }
                        ]
                    },
                    {   
                        xtype: 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel: t('Completion Date'),
                        labelWidth: 120,
                            items:[
                            {
                                xtype     : 'datefield',
                                name      : 'completion_date',
                                width     : 100,
                                listeners : {
                                    render : function(datefield) {
                                        if(Use == 'Edit')
                                            datefield.setValue(new Date(completion_date));
                                    }
                                },
                            },
                            {
                                xtype: 'timefield',
                                name: 'completion_date_time',
                                minValue: '12:00 AM',
                                maxValue: '11:45 PM',
                                increment: 15,
                                width:100,
                                listeners : {
                                    render : function(datefield) {
                                        if(Use == 'Edit')
                                            datefield.setValue(completion_date_time);
                                    }
                                },
                            }
                        ]
                    },
                    {   xtype: 'combo',
                       
                        fieldLabel: t('Status'),
                        labelWidth: 120,
                        name: 'status',
                        width:305,
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
                        fieldLabel: t('Priority'),
                        name: 'priority',
                        width:305,
                        store: [
                            ['High', 'High'],
                            ['Normal', 'Normal'],
                            ['Low', 'Low']
                        ],
                        fields: ['value', 'text'],
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'abbr',
                        value:priority
                    },
                    {   xtype: 'combo',
                        labelWidth: 120,
                        fieldLabel: t('Associated Element'),
                        name: 'associated_element',
                        store: [
                            ['Object', 'Object'],
                            ['Document', 'Document'],
                            ['Asset', 'Asset']
                        ],
                        fields: ['value', 'text'],
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'abbr',
                        width:305,
                        value:associated_element
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel: t('Association Element'),
                        labelWidth: 120,
                        items:[AssociationFeilds] 
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
                    {   text: 'Save',
                        handler : function(grid,rowIndex) {
                            var form = AddTaskForm.getForm();
                            form.submit({
                                method  : 'POST',
                                url:'../'+url, //for update/edit & add
                                params: {
                                    "id" : taskDetail['id']
                                },
                                success : function() {
                                    Ext.getCmp('mygrid').getStore().load({
                                        params: {
                                            data: JSON.stringify({})
                                        }
                                    });
                                    Ext.Msg.alert('Thank You', 'Your Task is '+msg, function() {
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
                        'id', 'subject', 'description', 'due_date', 'priority', 'status', 'start_date', 'completion_date', 'associated_element'
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
            title: t("Task Manager"),
            trackMouseOver:false,
            //disableSelection:true,
            region: "center",
            columns: typesColumns,
            tbar: toolbar,
            id:'mygrid',
            listeners: {
                itemcontextmenu: function(grid, record, item, rowIndex, e, eOpts) {
                    var menu_grid = new Ext.menu.Menu({
                        items:[
                            { 
                                text: 'Edit',
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
                                                AddEditTaskForm('Edit',taskDetail);
                                            }
                                        },
                                        failure: function(response, opts) {
                                            console.log('server-side failure with status code' + response.status);
                                        }
                                    });    
                                }.bind(this)
                            },
                            { 
                                text: t('Delete'),
                                icon: '/pimcore/static6/img/flat-color-icons/delete.svg',
                                handler: function () {
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
                                text: t('View'),
                                icon: '/pimcore/static6/img/flat-color-icons/view.svg',
                                handler: function (data,rowIndex) {
                                    
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

        //this.grid.on("rowcontextmenu", this.onRowContextmenu.bind(this));
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

        console.log(arraySelected);
        Ext.Ajax.request({
            url: '../completed_task',
            params: {
                "id" :Ext.encode(id)
            },
            method: 'GET',  
            success: function(response, opts) {
                Ext.getCmp('mygrid').getStore().load({
                    params: {
                        data: JSON.stringify({})
                    }
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
                console.log('server-side failure with status code' + response.status);
            }
        }); 
    }
     
});



             
var TaskManagementBundlePlugin = new pimcore.plugin.TaskManagementBundle();
