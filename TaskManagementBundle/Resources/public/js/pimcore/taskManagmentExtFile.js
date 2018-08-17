console.log("x");
pimcore.registerNS("pimcore.plugin.taskManagmentExtFile");

pimcore.plugin.taskManagmentExtFile = Class.create({
    /*
    * @constructor
    */
    initialize:function (config){
        pimcore.plugin.broker.registerPlugin(this);
        console.log("z");
    },
    getClassName: function () {
        return "pimcore.plugin.taskManagmentExtFile";
    },
});

