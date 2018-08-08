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
    },
    addMenuIntools: function (scope) {
        var navigation = Ext.get("pimcore_menu_extras");
         var user = pimcore.globalmanager.get("user");
        var userPermissions = user.permissions;
        
        if (user.admin == true ) {
           // var ulElement = navigation.selectNode('ul');
            var li = document.createElement("li");

            li.setAttribute("id", "task_manegment_menu");
            li.setAttribute("class", "pimcore_menu_mds pimcore_menu_item pimcore_menu_needs_children");
           
            li.setAttribute("data-menu-tooltip", "Task Management");
            navigation.insertSibling(li,'after');
            pimcore.helpers.initMenuTooltips();
            Ext.get("task_manegment_menu").on("click", function (e, el) {
               
               scope.showTab();
            });
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
                            name: 'subject',
                            fieldLabel: t('Subject'),
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
                text: t("subject"), width: 50, sortable: true, dataIndex: 'subject'
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
                width: 30,
                items: [{
                    tooltip: t('delete'),
                    icon: "/pimcore/static6/img/flat-color-icons/delete.svg",
                    handler: function (grid, rowIndex) {
                        grid.getStore().removeAt(rowIndex);
                    }.bind(this)
                }]
            }
        ];
        
       
        function AddEditTaskForm(Use,taskDetail) {
            if(Use == 'Add') {
                var panelTitle         = "Add Task";
                var url                = 'save_task';
                var msg                = 'Saved';
                var description        ='';
                var due_date           ='';
                var priority           ='';
                var status             ='';
                var start_date         ='';
                var completion_date    ='';
                var associated_element ='';
                var subject            ='';
                
                
                
            } else if(Use == 'Edit') {
                var panelTitle = "Edit Task";
                var url = 'update_task';
                var msg = 'Updated';
                var description        = taskDetail['description'];
                var due_date           = taskDetail['due_date'];
                var priority           = taskDetail['priority'];
                var status             = taskDetail['status'];
                var start_date         = taskDetail['start_date'];
                var completion_date    = taskDetail['completion_date'];
                var associated_element = taskDetail['associated_element'];
                var subject            = taskDetail['subject'];
            }    
            
            var AddTaskForm = Ext.create('Ext.form.Panel', {
                renderTo: document.body,
                height: 500,
                width: 500,
                bodyPadding: 10,
                defaultType: 'textfield',
                items: [
                    {
                        xtype     : 'textareafield',
                        fieldLabel: 'Description',
                        name      : 'description',
                        grow      : true,
                        anchor    : '100%',
                        allowBlank: false,
                        value     : description
                    },
                    {   
                        xtype     : 'datefield',
                        fieldLabel: 'Due Date',
                        name      : 'due_date',
                        listeners : {
                            render : function(datefield) {
                                if(Use == 'Edit')
                                    datefield.setValue(new Date(due_date));
                            }
                        }
                    },
                    {   
                        xtype: 'combo',
                        fieldLabel: 'Priority',
                        name: 'priority',
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
                        fieldLabel: 'Status',
                        name: 'status',
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
                        xtype: 'datefield',
                        fieldLabel: 'Start Date',
                        name: 'start_date',
                        listeners : {
                            render : function(datefield) {
                                if(Use == 'Edit')
                                    datefield.setValue(new Date(start_date));
                            }
                        }    
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: 'Completion Date',
                        name: 'completion_date',
                        listeners : {
                            render : function(datefield) {
                                if(Use == 'Edit')
                                    datefield.setValue(new Date(completion_date));
                            }
                        }
                    },
                    {   xtype: 'combo',
                        fieldLabel: 'Associated Element',
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
                        value:associated_element
                    },

                    {   
                        xtype: 'textfield',
                        fieldLabel: 'Subject',
                        name: 'subject',
                        value:subject
                    }
                ]
            });
            var win = new Ext.Window({
                modal:true,
                title:panelTitle,
                width:500,
                height:500,
                closeAction :'hide',
                plain       : true,
                items  : [AddTaskForm],
                buttons: [
                    {   text: 'Save',
                        handler : function(btn) {
                            var form = AddTaskForm.getForm();
                            form.submit({
                                method  : 'POST',
                                url:'../'+url,
                                params: {
                                    "id" : taskDetail['id']
                                },
                                success : function() {
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
        

        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'main-toolbar',
            items: [
                {
                    text: t('Add Task'),
                    handler: function() {
                       AddEditTaskForm('Add',[]);
                    },
                    iconCls: "pimcore_icon_restore",
                    id: "pimcore_button_add",
                    disabled: false
                }, '-', {
                    text: t('delete_selected'),
                    handler: "",//this.deleteSelected.bind(this),
                    iconCls: "pimcore_icon_delete",
                    id: "pimcore_button_delete",
                    disabled: true
                }, "-",{
                    text: t('Edit'),
                    handler: function() {
                        var id = "121";
                        /* store = new Ext.data.JsonStore({
                            url: '../edit_task',
                        });
                        store.load(); */
                        Ext.Ajax.request({
                            url: '../edit_task',
                            params: {
                                "id" : id
                            },
                            method: 'GET',  
                            success: function(response, opts) {
                                var obj = Ext.decode(response.responseText);
                                var taskDetail = obj['success'][0];
                                AddEditTaskForm('Edit',taskDetail);
                            },

                            failure: function(response, opts) {
                                console.log('server-side failure with status code ' + response.status);
                            }
                        });
                   
                        
                        
                    }, 
                    iconCls: "pimcore_icon_delete",
                    id: "pimcore_button_delete",
                    disabled: false
                },
                {
                    text: t('Archive'),
                    handler: "",//this.onFlush.bind(this),
                    iconCls: "pimcore_icon_flush_recyclebin",
                    id: "pimcore_recyclebin_button_flush",
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

        this.selectionColumn = new Ext.selection.CheckboxModel();
       // this.selectionColumn.on("selectionchange", this.updateButtonStates.bind(this));
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
            disableSelection:true,
            region: "center",
            columns: typesColumns,
            tbar: toolbar,
//            listeners: {
//                "rowclick": ""//this.updateButtonStates.bind(this)
//            },
             viewConfig: {
                enableRowBody: true,
                showPreview: true,
            },
        });

        //this.grid.on("rowcontextmenu", this.onRowContextmenu.bind(this));
         this.store.load();
        return this.grid;
    },
});

var TaskManagementBundlePlugin = new pimcore.plugin.TaskManagementBundle();
