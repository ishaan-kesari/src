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
namespace TaskManagementBundle\Model;
 
use Pimcore\Model\AbstractModel;
 
/*
 * Task Management table getter and setter defination
 * */
class Tasks extends AbstractModel {
 
    /**
     * @var bigint(20)
    */
    public $id;
 
    /**
     * @var text
    */
    public $description;
 
    /**
     * @var date
    */
    public $dueDate;
    
    /**
     * @var enum
    */
    public $priority;
    
    /**
     * @var enum
    */
    public $status;
    
    /**
     * @var date
     */
    public $startDate;
    
    /**
     * @var date
     */
    public $completionDate;
    
    /**
     * @var varchar: Object, Document, Asset path.
     */
    public $associatedElement;
    
    
    /**
     * @var varchar
    */
    public $subject;
    
    /**
     * @var int
    */
    public $userOwner;
    
    /**
     * get score by id
     *
     * @param $id
     * @return null|self
    */
    public static function getById($id) {
        try {
            $obj = new self;
            $obj->getDao()->getById($id);
            return $obj;
        }
        catch (\Exception $ex) {
             // \Logger::warn("Vote with id $id not found");
        }
 
        return null;
    }
    
    /**
     * @param $id
     * 
     */
    public function setId($id) {
        $this->id = $id;
    }
 
    /**
     * @return bigint(20)
     */
    public function getId() {
        return $this->id;
    }
    
    /**
     * @param $description
     */
    public function setDescription($description) {
        $this->description = $description;
    }
 
    /**
     * @return text
     */
    public function getDescription() {
        return $this->description;
    }
    
    
    /**
     * @param $dueDate
     */
    public function setDueDate($dueDate) {
        $this->dueDate = $dueDate;
    }
 
    /**
     * @return date
     */
    public function getDueDate() { 
        return $this->dueDate;
    }
 
    
    /**
     * @param $priority
     */
    public function setPriority($priority) {
        $this->priority = $priority;
    }
 
    /**
     * @return enum
     */
    public function getPriority() {
        return $this->priority;
    }
    
    
    /**
     * @param $status
     */
    public function setStatus($status) {
        $this->status = $status;
    }
 
    /**
     * @return enum
     */
    public function getStatus() {
        return $this->status;
    }
    
    
    /**
     * @param $startDate
     */
    public function setStartDate($startDate) {
        $this->startDate = $startDate;
    }
 
    /**
     * @return date
     */
    public function getStartDate() {
        return $this->startDate;
    }
    
    
    /**
     * @param $completionDate
     */
    public function setCompletionDate($completionDate) {
        $this->completionDate = $completionDate;
    }
 
    /**
     * @return date
     */
    public function getCompletionDate() {
        return $this->completionDate;
    }
    
    
    /**
     * @param $associatedElement
     */
    public function setAssociatedElement($associatedElement) {
        $this->associatedElement = $associatedElement;
    }
 
    /**
     * @return varchar(255)
     */
    public function getAssociatedElement() {
        return $this->associatedElement;
    }
    
    
    /**
     * @param $subject
     */
    public function setSubject($subject) {
        $this->subject = $subject;
    }
 
    /**
     * @return varchar(255)
     */
    public function getSubject() {
        return $this->subject;
    }
    /**
     * @param $userOwner
     */
    public function setUserOwner($userOwner) {
        $this->userOwner = $userOwner;
    }
 
    /**
     * @return int(11)
     */
    public function getUserOwner() {
        return $this->userOwner;
    }
    
}