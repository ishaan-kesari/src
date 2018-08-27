<?php
/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Enterprise License (PEL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PEL
 */

namespace TaskManagementBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;

class TaskManagementBundle extends AbstractPimcoreBundle
{
    /**
     * @return array of Javascript files.
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
    
    /**
     * @return array of CSS files.
     */
    public function getCssPaths()
    {
        return [
            '/bundles/taskmanagement/css/style.css'
        ];
    }
    
    /**
     * @return Installer
     */
    public function getInstaller()
    {
        return new Installer();
    }
}
