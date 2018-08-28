/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Enterprise License (PEL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) 2009-2016 pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PEL
 */

pimcore.registerNS("pimcore.layout.portlets.taskportlet");
pimcore.layout.portlets.taskportlet = Class.create(pimcore.layout.portlets.abstract, {

    getType: function () {
        return "pimcore.layout.portlets.taskportlet";
    },
    // Portlet name
    getName: function () {
        return "Task - Latest 10";
    },
    // Portlet icon
    getIcon: function () {
        return "task_management_icon";
    },

    getLayout: function (portletId) {

       var store = new Ext.data.Store({
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                url: '../admin/task/portlet',
                reader: {
                    type: 'json',
                     rootProperty: 'data'
                    //rootProperty: 'total'
                }
            },
            fields: [ 'id', 'subject', 'description', 'dueDate', 'priority', 'status', 'startDate', 'completionDate', 'associatedElement']
        });

        store.load();

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            columns: [
                {text: t("subject"), sortable: false, dataIndex: 'subject'},
                {text: t('priority'), width: 150, sortable: false, dataIndex: 'priority'},
                {text: t('associated_element'),  sortable: false, dataIndex: 'associatedElement', flex: 1}
            ],
            stripeRows: true,
            autoExpandColumn: 'associated_element'
        });

        this.layout = Ext.create('Portal.view.Portlet', Object.extend(this.getDefaultConfig(), {
            title: this.getName(),
            iconCls: this.getIcon(),
            height: 275,
            layout: "fit",
            items: [grid]
        }));

        this.layout.portletId = portletId;
        return this.layout;
    }

});
