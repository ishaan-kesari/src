<?php
 /*
  * TaskManagementBundle
  * 
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
     * @var datetime
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
     * @var datetime
     */
    public $startDate;
    
    /**
     * @var datetime
     */
    public $completionDate;
    
    /**
     * @var enum
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
     * @return datetime
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
     * @return enum
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