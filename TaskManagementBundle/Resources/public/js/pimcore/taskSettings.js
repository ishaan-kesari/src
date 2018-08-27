pimcore.registerNS("pimcore.plugin.taskSettings");

pimcore.plugin.taskSettings = Class.create({
    
    initialize: function () {
        this.getData();
    },
    /**
     * Notification form with save handler.
     * 
     * @returns {Ext.Panel}
     */
    getData:function() {
        if (!this.panel) {
            // setting panel
            this.panel = new Ext.Panel({
                id:         "task_management_settings",
                title:      t("task_settings"),
                border:     false,
                layout:     "fit",
                closable:   true,
                icon:       '/pimcore/static6/img/flat-color-icons/settings.svg',
            });
            // Form panel for field container
            this.settingForm = new Ext.FormPanel({
                height:'100',
                width:'100',
                xtype: 'fieldcontainer',
                fieldLabel: 'Notification',
                defaultType: 'checkboxfield',
                items: [
                    {
                        boxLabel  : t('notification'),
                        name      : 'notification',
                        id        : 'notification'
                    },
                ]
                 
            });
            // Notification form panel
            this.notificationMenu = new Ext.FormPanel({
                title: t('task_settings'),
                height:890,
                width:835,
                chkBoxConfig: {
                    columnWidth: 0.5,
                    padding: '0 20 0 0'
                },
                items:[ 
                    {  
                        margin: 20,
                        defaultType: 'checkboxfield',
                        items: [
                            {
                                boxLabel  : t('Notification Status'),
                                name      : 'notification',
                                id        : 'notification',
                                listeners: {
                                    change: function (checkbox, newVal, oldVal) {
                                        if(newVal==true && oldVal==false){
                                            Ext.getCmp("notificationFrequencyId").enable();
                                        } else if(newVal==false && oldVal==true){
                                            Ext.getCmp("notificationFrequencyId").disable();
                                        }
                                        
                                    }
                                }
                            }
                        ],
                    },
                    {
                            xtype: 'combo',
                            fieldLabel: t('Number of days before:'),
                            editable:false,
                            margin:20,
                            allowBlank: false,
                            id:'notificationFrequencyId',
                            labelWidth: 200,
                            name: 'notificationFrequency',
                            store: [
                                ['1', '1'],
                                ['2', '2'],
                                ['0', '0']
                            ],
                            fields: ['value', 'text'],
                            displayField: 'name',
                            valueField: 'abbr'
                    },
                    {
                        xtype: 'button',
                        margin:20,
                        text: t('save'),
                        handler: this.save.bind(this)
                    }    
                ]
               
            });
            
            Ext.getCmp("notificationFrequencyId").disable();
            
            var layout = new Ext.Panel({
                border: false,
                layout: "border",
                items: [this.notificationMenu],
            });
             
            this.panel.add(layout);
            
            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("task_management_settings");

            this.panel.on("destroy", function () {
                pimcore.globalmanager.remove("task_management_settings");
            }.bind(this));
            
            pimcore.layout.refresh();
        }
        return this.panel;
    },
    // save handler
    save:function() {
        var notificationStatus =  Ext.getCmp("notification").getValue();
        var ymldata = "Notification: "+notificationStatus+"&";
        if(notificationStatus == false) {
        
        } else if(notificationStatus == true){
           var notificationFrequency = Ext.getCmp("notificationFrequencyId").getValue();
            if(notificationFrequency == 1) {
               ymldata = ymldata+"1: true&2:false";
            } else if(notificationFrequency == 2) {
               ymldata = ymldata+"1: false&2:true&";
            }
        }
        
        Ext.Ajax.request({
            url: '../settings_save',
            params: {
                "data": ymldata
            },
            method: 'GET',
            success: function() {
                Ext.Msg.alert("Thank You","Settings saved successfully");
            },
            failure: function() {
                console.log("Problem in saving task settings");
            }
        });
    }
});

