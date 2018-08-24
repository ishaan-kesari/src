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
        if (!Ext.getCmp("task_manager_panel")) {
            var dataCon = new pimcore.plugin.taskpanel();
        } else {
            Ext.getCmp("pimcore_panel_tabs").setActiveItem("task_manager_panel");
        }
         
    },
   
});

