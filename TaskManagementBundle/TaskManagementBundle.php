<?php

namespace TaskManagementBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;

class TaskManagementBundle extends AbstractPimcoreBundle
{
    /*
	
    */	 	
    public function getJsPaths()
    {
        return [
            '/bundles/taskmanagement/js/pimcore/startup.js',
            '/bundles/taskmanagement/js/pimcore/addMenuInToolsJs.js',
            '/bundles/taskmanagement/js/pimcore/toolbar.js',
            '/bundles/taskmanagement/js/pimcore/contextMenu.js',
             '/bundles/taskmanagement/js/pimcore/taskpanel.js',
            '/bundles/taskmanagement/js/pimcore/portlets/taskportlet.js',
            '/bundles/taskmanagement/js/pimcore/taskSettings.js',
            
        ];
    }

    public function getCssPaths()
    {
        return [
            '/bundles/taskmanagement/css/style.css'
        ];
    }
    
    public function getInstaller()
    {
        return new Installer();
    }
}
