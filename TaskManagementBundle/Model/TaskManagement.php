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
class TaskManagement extends AbstractModel {
 
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
    public $due_date;
    
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
    public $start_date;
    
    /**
     * @var datetime
     */
    public $completion_date;
    
    /**
     * @var enum
     */
    public $associated_element;
    
    
    /**
     * @var varchar
    */
    public $subject;
    
    
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
            \Logger::warn("Vote with id $id not found");
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
     * @param $due_date
     */
    public function setDue_date($due_date) {
        $this->due_date = $due_date;
    }
 
    /**
     * @return datetime
     */
    public function getDue_date() { 
        return $this->due_date;
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
     * @param $start_date
     */
    public function setStart_date($start_date) {
        $this->start_date = $start_date;
    }
 
    /**
     * @return datetime
     */
    public function getStart_date() {
        return $this->start_date;
    }
    
    
    /**
     * @param $completion_date
     */
    public function setCompletion_date($completion_date) {
        $this->completion_date = $completion_date;
    }
 
    /**
     * @return datetime
     */
    public function getCompletion_date() {
        return $this->completion_date;
    }
    
    
    /**
     * @param $associated_element
     */
    public function setAssociated_element($associated_element) {
        $this->associated_element = $associated_element;
    }
 
    /**
     * @return enum
     */
    public function getAssociated_element() {
        return $this->associated_element;
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
    
}