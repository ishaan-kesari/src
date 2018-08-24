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
        // pimcore.layout.reload();
    },
    getClassName: function () {
        return "pimcore.plugin.taskManagmentExtFile";
    },
    addMenuInTools: function () {
        var user = pimcore.globalmanager.get("user");
        if (user.isAllowed("task_management") ) {
            var toolbar = pimcore.globalmanager.get("layout_toolbar");
            
            var action = new Ext.Action({
                text: t("task_management"),
                iconCls: "task_management_icon pimcore_menu_mds pimcore_menu_item pimcore_menu_needs_hildren ",
                menu: {
                    xtype: 'menu',                         
                    items: [{
                            text: t("listing"),
                            id: "task_management_menu",
                            icon: '/pimcore/static6/img/flat-color-icons/list.svg',
                            cls:'backColor ',
                            handler: function() {
                               new pimcore.plugin.addMenuInToolsJs().showTab();
                            },
                        },{
                            text: t("settings"),
                            id:"task_management_setting",
                            icon: '/pimcore/static6/img/flat-color-icons/settings.svg',
                            cls:'backColor ',
                            handler: function() {
                                new pimcore.plugin.addMenuInToolsJs().showSettings();
                            },
                        }
                    ]
                }
            });
            
            toolbar.extrasMenu.add(action);
            pimcore.helpers.initMenuTooltips();
        } else {
            return false;
        }
    },
    showTab: function() {
        if (!Ext.getCmp("task_manager_panel")) {
            new pimcore.plugin.taskpanel();
        } else {
            Ext.getCmp("pimcore_panel_tabs").setActiveItem("task_manager_panel");
        }
    },
    showSettings: function() {
        if (!Ext.getCmp("task_management_settings")) {
            new pimcore.plugin.taskSettings();
        } else {
            Ext.getCmp("pimcore_panel_tabs").setActiveItem("task_management_settings");
        }
    }
   
});

