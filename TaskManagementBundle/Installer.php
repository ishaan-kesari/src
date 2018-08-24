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

use TaskManagementBundle\Model\Tasks\Dao;
use Pimcore\Db;
use Pimcore\Extension\Bundle\Installer\AbstractInstaller;
use \Pimcore\Model\User\Permission\Definition;

class Installer extends AbstractInstaller
{
    public function isInstalled()
    {
        try {
            $result = Db::get()->fetchAll("show tables like '" . Dao::TABLE_NAME . "'");
            return !empty($result) ? true : false;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function canBeInstalled()
    {
        return !$this->isInstalled();
    }

    public function install()
    {
        
        $permissionDefinition = new Definition();
        $permissionDefinition->setKey("task_management");
        $permissionDefinition->save();
        $db = Db::get();

        $db->query("
            CREATE TABLE `" . Dao::TABLE_NAME . "` (
                `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                `subject` varchar(255) NOT NULL,
                `description` text,
                `dueDate` date NOT NULL,
                `priority` enum('High','Normal','Low') NOT NULL,
                `status` enum('Not started','In Progress','Completed') NOT NULL,
                `startDate` date NOT NULL,
                `completionDate` date NOT NULL,
                `associatedElement` varchar(255) NOT NULL,
                `userOwner` int(11) unsigned NOT NULL,
                
                PRIMARY KEY (`id`)
                          )
                          COLLATE='utf8_general_ci'
                          ENGINE=InnoDB
                          AUTO_INCREMENT=0;
        ")->closeCursor();
        
    
    }

    public function canBeUninstalled()
    {
        return $this->isInstalled();
    }

    public function uninstall()
    {
        $db = Db::get();
        $db->query("drop table if exists `" . Dao::TABLE_NAME . "`")->closeCursor();
    }
}
