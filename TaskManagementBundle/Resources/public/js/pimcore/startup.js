pimcore.registerNS("pimcore.plugin.TaskManagementBundle");

pimcore.plugin.TaskManagementBundle = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.TaskManagementBundle";
    },
    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
    },
    pimcoreReady: function (params, broker) {
        var addMenuInToolsJs = new pimcore.plugin.addMenuInToolsJs();
        addMenuInToolsJs.addMenuInTools(this);
    }
    
});

var taskManagementBundlePlugin = new pimcore.plugin.TaskManagementBundle();
