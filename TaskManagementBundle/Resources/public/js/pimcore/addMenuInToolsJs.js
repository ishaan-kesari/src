pimcore.registerNS("pimcore.plugin.addMenuInToolsJs");

pimcore.plugin.addMenuInToolsJs = Class.create({
    /*
    * @constructor
    */
    initialize:function (config){
         this.config = {
            searchParams: {},
        };
        Ext.apply(this.config, config);
        this.searchParams = this.config.searchParams;
    },
    getClassName: function () {
        return "pimcore.plugin.taskManagmentExtFile";
    },
    addMenuInTools: function () {
        var user = pimcore.globalmanager.get("user");
        if (user.admin == true ) {
            var toolbar = pimcore.globalmanager.get("layout_toolbar");
            var action = new Ext.Action({
                id: "task_management_menu",
                text: t("task_management"),
                iconCls:"task_management_icon pimcore_menu_mds pimcore_menu_item pimcore_menu_needs_hildren",
                handler: function() {
                    var addMenuInToolsJs = new pimcore.plugin.addMenuInToolsJs();
                    addMenuInToolsJs.showTab();
                },
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
            
            this.priorityStore = [
                ['High', 'High'],
                ['Normal', 'Normal'],
                ['Low', 'Low']
            ];
            this.statusStore = [
                ['Not started', 'Not started'],
                ['In Progress', 'In Progress'],
                ['Completed', 'Completed']
            ];
                  
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
                            name: 'subject',
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
                            store: this.statusStore,
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
        this.store.load();
       // this.pagingToolbar.moveFirst();
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
        
        var toolbarObj = new pimcore.plugin.toolbar();
        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'main-toolbar',
            items: [
                {
                    text: t('add_task'),
                    handler:toolbarObj.addTask.bind(this),
                    icon: "/pimcore/static6/img/flat-color-icons/add_row.svg",
                    id: "pimcore_button_add",
                    disabled: false
                }, '-', {
                    text: t('delete_selected'),
                    handler: toolbarObj.deleteSelected.bind(this),
                    iconCls: "pimcore_icon_delete",
                    id: "pimcore_button_delete",
                    disabled: true
                }, 
                {
                    text: t('completed'),
                    handler: toolbarObj.completedStatusUpdate.bind(this),
                    iconCls: "task_completed_icon",
                    id: "pimcore_button_completed",
                    disabled: true
                }                
              
            ]
        });
        
        this.selectionColumn = new Ext.selection.CheckboxModel();
        this.selectionColumn.on("selectionchange", toolbarObj.buttonStates.bind(this));
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
                itemcontextmenu: new pimcore.plugin.contextMenu().start.bind(this)
            },
            
             viewConfig: {
                enableRowBody: true,
                showPreview: true,
            },
        });

        this.store.load();
        return this.grid;
    },
   
});

