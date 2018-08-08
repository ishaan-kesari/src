pimcore.registerNS("pimcore.plugin.CommonScreen");

pimcore.plugin.CommonScreen = Class.create(pimcore.plugin.admin, {
    getClassName: function() {
        return "pimcore.plugin.CommonScreen";
    },

    initialize: function() {
        pimcore.plugin.broker.registerPlugin(this);
    },

    pimcoreReady: function (params,broker){
        // add a sub-menu item under "Extras" in the main menu
       // var toolbar = pimcore.globalmanager.get("layout_toolbar");

       /* var action = new Ext.Action({
            id: "commonscreen_menu_item",
            text: "View All NPIs",
            iconCls:"commonscreen_menu_icon",
            handler: this.showTab
        });*/

        //toolbar.extrasMenu.add(action);
       // toolbar.leftNavigation.add(action);
       this.leftNavigation(this);
    },
    leftNavigation: function (scope) {
        var navigation = Ext.get("pimcore_navigation");
        var user = pimcore.globalmanager.get("user");
        var userPermissions = user.permissions;
        if (user.admin == true || (in_array('ViewAllNPI', userPermissions))) {
            var ulElement = navigation.selectNode('ul');
            var li = document.createElement("li");

            li.setAttribute("id", "commonscreen_menu_item");
            li.setAttribute("class", "commonscreen_menu_icon pimcore_menu_item pimcore_menu_needs_children pimcore_icon_website");
            li.setAttribute("style", "width: 30px; margin-left: 7px; margin-top: 1px;");
            li.setAttribute("data-menu-tooltip", "View All NPIs");
            ulElement.appendChild(li);
            pimcore.helpers.initMenuTooltips();
            Ext.get("commonscreen_menu_item").on("click", function (e, el) {
               
               scope.showTab();
            });
        } else {
            return false;
        }
    },
    
    showTab: function() {
      
        commonscreenPlugin.panel = new Ext.Panel({
            id:         "commonscreen_check_panel",
            title:      "NPI",
            border:     false,
            layout:     "fit",
            closable:   true,
            items:      [commonscreenPlugin.getGrid()]
        });

        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.add(commonscreenPlugin.panel);
        tabPanel.setActiveTab(commonscreenPlugin.panel);
        
        pimcore.layout.refresh();
    },

    getGrid: function() {

    // fetch data from a webservice (which we haven't written yet!)
    commonscreenPlugin.store = new Ext.data.JsonStore({
        totalProperty: 'total',
        pageSize: 10,
        proxy: {
            url: '/plugin/CommonScreen/request/get-all-npi',
            type: 'ajax',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        },
        fields: [
           "NPI_Name",
           "NPI_Type",
           "Brand",
           "Product_Group",
           "Pattern",
           "site",
           "project_owner",
           "NPI_Status",
           "Initiation_Date"
        ],
         baseParams:{
                showOpt: 1,
        },
      listeners: {
                beforeload: function (store) {
                    commonscreenPlugin.store.getProxy().extraParams.limit = commonscreenPlugin.pagingtoolbar.pageSize;
                    commonscreenPlugin.store.getProxy().extraParams.start = 0;
                }            
        }
    });

    commonscreenPlugin.pagingtoolbar = new Ext.PagingToolbar({
            pageSize: 10,
            store: commonscreenPlugin.store,
            displayInfo: true,
            displayMsg: '{0} - {1} /  {2}',
            emptyMsg: 'No NPI found'
    });

      commonscreenPlugin.pagingtoolbar.add("-");

        commonscreenPlugin.pagingtoolbar.add(new Ext.Toolbar.TextItem({
            text: t("items_per_page")
        }));
        commonscreenPlugin.pagingtoolbar.add(new Ext.form.ComboBox({
            store: [
                [10, "10"],
                [20, "20"],
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
                    commonscreenPlugin.pagingtoolbar.pageSize = intval(rec.data.field1);
                    commonscreenPlugin.store.pageSize = intval(rec.data.field1);
                    commonscreenPlugin.pagingtoolbar.moveFirst();
                }.bind(this)
            }
        }));

     var typesColumns = [
            {header: "NPI Name", flex: 200, sortable: true, dataIndex: 'NPI_Name'},
            {header: "NPI Type", flex: 200, sortable: true, dataIndex: 'NPI_Type'},
            {header: "Brand", flex: 200, sortable: true, dataIndex: 'Brand'},
            {header: "Product Group", flex: 200, sortable: true, dataIndex: 'Product_Group'},
            {header: "Pattern", flex: 200, sortable: true, dataIndex: 'Pattern'},
            {header: "Site", flex: 200, sortable: true, dataIndex: 'site'},
            {header: "Project Owner", flex: 200, sortable: true, dataIndex: 'project_owner'},
            {header: "NPI Status", flex: 200, sortable: true, dataIndex: 'NPI_Status'},
            {header: "Initiation Date", flex: 200, sortable: true, dataIndex: 'Initiation_Date'},
        
            {
                xtype: 'actioncolumn',
                width: 30,
                items: [{
                    tooltip: t('open'),
                    icon: "/pimcore/static/img/icon/pencil_go.png",
                    handler: function (grid, rowIndex) {
                                    var data = grid.getStore().getAt(rowIndex).data;
                                    var documents = ['snippet','link','document','page'];
                                    //var objects = ['object','variant'];
                                    if (jQuery.inArray(data.elementType, documents)!='-1') {
                                        data.elementType = 'document';
                                    } else {
                                        data.elementType = 'object';
                                    }
                                    pimcore.helpers.openElement(data.o_id, data.elementType);

                                }.bind(this),
                }]
            }
        ];
    commonscreenPlugin.grid = new Ext.grid.GridPanel({
            store: commonscreenPlugin.store,
            region: 'center',
            tbar: [{
                id: 'ShowAll',
                text: 'Show All',
                width: 170,
                border: true,
                enableToggle: true,
                handler: function(){
                    Ext.getCmp('ShowActive').toggle(false);
                    commonscreenPlugin.store.getProxy().extraParams.showOpt = 1;
                    commonscreenPlugin.store.load();
                }
            },"-",{
                id: 'ShowActive',
                text: 'Show Only Active',
                width: 170,
                border: true,
                enableToggle: true,
                handler: function(){
                    Ext.getCmp('ShowAll').toggle(false);
                     commonscreenPlugin.store.getProxy().extraParams.showOpt = 0;
                    commonscreenPlugin.store.load();
                }
            },"-"
            ],
            columns: typesColumns,
                    /*[{
                        hideable: false,
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [
                            {
                                tooltip: t('open'),
                                icon: "/pimcore/static/img/icon/pencil_go.png",
                                handler: function (grid, rowIndex) {
                                    var data = grid.getStore().getAt(rowIndex).data;
                                    var documents = ['snippet','link','document','page'];
                                    //var objects = ['object','variant'];
                                    if (jQuery.inArray(data.elementType, documents)!='-1') {
                                        data.elementType = 'document';
                                    } else {
                                        data.elementType = 'object';
                                    }
                                    
                                    console.log(data);
                                    pimcore.helpers.openElement(data.o_id, data.elementType);

                                }.bind(this)
                                ,
                                getClass: function(value,metadata,record) {

                                    return 'x-grid-center-icon';

                                }
                            }
                        ]
                    },{
                header: 'NPI Name',
                id: "NPI Name",
                width: 170,
                sortable: true,
                searchable:true,
                dataIndex: 'NPI_Name',

            },
            {
                header: 'NPI Type',
                id: "NPI Type",
                width: 170,
                sortable: true,
                 searchable:true,
                dataIndex: 'NPI_Type',

            },
            {
                header: 'Brand',
                id: "Brand",
                width: 170,
                sortable: true,
                 searchable:true,
                dataIndex: 'Brand',

            },
             {
                header: 'Product Group',
                id: "Product_Group",
                width: 170,
                sortable: true,
                 searchable:true,
                dataIndex: 'Product_Group',

            },
             {
                header: 'Pattern',
                id: "Pattern",
                width: 170,
                sortable: true,
                 searchable:true,
                dataIndex: 'Pattern',

            },
            {
                header: 'Site',
                id: "Site",
                width: 170,
                sortable: true,
                 searchable:true,
                dataIndex: 'site',

            },
            {
                header: 'Project Owner',
                id: "Project Owner",
                width: 170,
                sortable: true,
                 searchable:true,
                dataIndex: 'project_owner',

            },
            {
                header: 'NPI Status',
                id: "NPI Status",
                width: 170,
                sortable: true,
                 searchable:true,
                dataIndex: 'NPI_Status',

            },{
                header: 'Initiation Date',
                id: "Initiation Date",
                width: 170,
                sortable: true,
                dataIndex: 'Initiation_Date',

            }],*/
            viewConfig: {
                enableRowBody: true,
                showPreview: true,
            },
           /* plugins: plugins,*/
           dataIndex: 'id',
          bbar: commonscreenPlugin.pagingtoolbar,
            
        });

    commonscreenPlugin.store.load();

   /*    commonscreenPlugin.grid.on("rowdblclick", function(record, element, rowIndex, e, eOpts) {
           commonscreenPlugin.showActions(element.data.NPI_Name);
            //pimcore.helpers.openObject(data.data.objectid);
        });*/

    return commonscreenPlugin.grid;
},

   /* showActions: function(NPI_Name){
        commonscreenPlugin.actionPanel = null;
        commonscreenPlugin.actionGrid = null;
        commonscreenPlugin.actionStore = null;
        
        commonscreenPlugin.actionPanel = new Ext.Panel({
            id: "Common_screen_actionpanel",
            title: "Purchase order details",
            iconCls: "pimcore_icon_highlight",
            border: false,
            layout: "fit",
            closable: true,
            items: [commonscreenPlugin.getActionGrid(NPI_Name)],
        });


        
        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.add(commonscreenPlugin.actionPanel);
        tabPanel.setActiveTab(commonscreenPlugin.actionPanel);

        pimcore.layout.refresh();

        return commonscreenPlugin.actionPanel;
    },


    getActionGrid: function(keyname) {
        //console.log("keyname is "+ keyname);

        commonscreenPlugin.actionStore = new Ext.data.JsonStore({
            proxy : {
                url: '/plugin/CommonScreen/request/get-workflow-info',
                type: 'ajax',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            fields: ["type" , "user" , "status" , "date"],

            baseParams: {
                requestId: keyname
            },
           
        });

        commonscreenPlugin.actionStore.getProxy().extraParams.requestId = keyname;
        commonscreenPlugin.actionStore.load();
        commonscreenPlugin.actionGrid = new Ext.grid.GridPanel({
            store: commonscreenPlugin.actionStore,
            region: 'center',
            columns: [{
                header: 'Type',
                id: "Type",
                width: 130,
                sortable: true,
                dataIndex: 'type',

            }, {
                header: 'User',
                id: "User",
                width: 120,
                sortable: true,
                dataIndex: 'user',
            },
            {
                header: 'Status',
                id: "Status",
                width: 120,
                sortable: true,
                dataIndex: 'status',
            },
            {
                header: 'Date',
                id: "Date",
                width: 120,
                sortable: true,
                dataIndex: 'date',
            },

            ],
            viewConfig: {
                enableRowBody: true,
                showPreview: true,
            },
            dataIndex: 'type',
        });

                
        return commonscreenPlugin.actionGrid;
    }*/


});



var commonscreenPlugin = new pimcore.plugin.CommonScreen();
