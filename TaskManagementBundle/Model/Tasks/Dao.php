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
namespace TaskManagementBundle\Model\Tasks;
use Pimcore\Model\Dao\AbstractDao;
/*
 * Contains Task Management data access object function definition such as save/delete 
 * @method getById($id = null)
 * @method save()
 * @method delete()
 */
class Dao extends AbstractDao {
 
    //tm_tasks
    const TABLE_NAME = 'tm_tasks';	
    protected $tableName = 'tm_tasks';
 
    /**
     * get Task by id
     *
     * @param null $id
     * @throws \Exception
     */
    public function getById($id = null) {
 
        if ($id != null)
            $this->model->setId($id);
 
        $data = $this->db->fetchRow('SELECT * FROM '.$this->tableName.' WHERE id = ?', $this->model->getId());
 
        if(!$data["id"])
            throw new \Exception("Object with the ID " . $this->model->getId() . " doesn't exists");
 
        $this->assignVariablesToModel($data);
    }
 
    /**
     * save Task
     */
    public function save() {
        $vars = get_object_vars($this->model); 
 
        $buffer = [];
 
        $validColumns = $this->getValidTableColumns($this->tableName); 

        if(count($vars))
            foreach ($vars as $k => $v) {
                
                if(!in_array($k, $validColumns))
                    continue;
               
                $getter = "get" . ucfirst($k);
                
                if(!is_callable([$this->model, $getter]))
                    continue;
 
                $value = $this->model->$getter();
 
                if(is_bool($value))
                    $value = (int)$value;
                
                if($value != null)
                   $buffer[$k] = $value;
                    
            }
            
            
            
        if($this->model->getId() !== null) {
           $this->db->update($this->tableName, $buffer, ["id" => $this->model->getId()]);
           return;
        }
            
        $this->db->insert($this->tableName, $buffer);
        $this->model->setId($this->db->lastInsertId());
    }
    
    /**
     * delete Task
     */
    public function delete() {
        $this->db->delete($this->tableName, ["id" => $this->model->getId()]);
    }
 
}
