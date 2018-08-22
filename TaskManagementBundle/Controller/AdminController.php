<?php

/* 
 * 
 * 
 */

namespace TaskManagementBundle\Controller;

use Pimcore\Controller\FrontendController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use TaskManagementBundle\Model;
use \Pimcore\Model\DataObject;
use Carbon\Carbon;

/* 
 * Task Backend Controller
 * 
 * @method saveTask(Request $request)
 * @method indexAction(Request $request)
 * 
 */
class AdminController extends FrontendController
{
    /**
     * @Route("/task_management__admin_index")
     */
    public function indexAction(Request $request) {
        
    }
    
    /**
     * @Route("/save_task")
     */
    public function saveTask(Request $request) { 
        $description       =  $request->get('description');
        $dueDate           =  Carbon::createFromFormat('m/d/y g:ia', $request->get('dueDate')." ".$request->get('dueDateTime'));
        $priority          =  $request->get('priority');
        $status            =  $request->get('status');
        $startDate         =  Carbon::createFromFormat('m/d/y g:ia', $request->get('startDate')." ".$request->get('startDateTime'));
        if($request->get('completionDate') != '' || $request->get('completionDateTime') !='') {  
            $completionDate    =  Carbon::createFromFormat('m/d/y g:ia', $request->get('completionDate')." ".$request->get('completionDateTime')); 
        }
        $associatedElement =  $request->get('associatedElement');
        $subject           =  $request->get('subject');
     
        $tasksObj = new Model\Tasks();
        $tasksObj->setDescription($description);
        $tasksObj->setDueDate($dueDate);
        $tasksObj->setPriority($priority);
        $tasksObj->setStatus($status);
        $tasksObj->setStartDate($startDate);
        if($request->get('completionDate') != '' || $request->get('completionDateTime') !='') { 
            $tasksObj->setCompletionDate($completionDate); 
        }
        $tasksObj->setAssociatedElement($associatedElement);
        $tasksObj->setSubject($subject);
        $tasksObj->save();
    
        return $this->json(array('success' => 'TaskAdded'));
    }
    
    /**
     * @Route("/show_task_listing")
     * 
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function showAction(Request $request) {
        $start = $request->get('start');
        $limit = $request->get('limit');
        
        $taskListingObj = new Model\Tasks\Listing();
        $taskListingObj->setOffset($start);
        $taskListingObj->setLimit($limit);
        
        $subject = $request->get('subject');
        $flag = false;
        if($subject != "") {
            $taskListingObj->setCondition('subject = ?',$subject, 'OR');
            $flag =true;
        }
        $fromDate = $request->get('fromDate');
        $fromTime =  $request->get('fromTime');
       
        if ($fromDate != "" && $fromTime =! "") {
             $fromDateTime = $this->parseDateTime($fromDate,$fromTime);
            if ($flag == true){
                $taskListingObj->addConditionParam('startDate < ?',$fromDateTime,'AND');
            }
            else {
                $taskListingObj->setCondition('startDate < ?',$fromDateTime,'AND');
                $flag =true;
            }

        }
        $toDate = $request->get('toDate');
        $toTime =  $request->get('toTime');
        $toDateTime = $this->parseDateTime($toDate,$toTime);
        if ($toDate != "" && $toTime =! "") {
            if ($flag == true){
                $taskListingObj->addConditionParam('dueDate > ?',$toDateTime,'AND');
            }
            else {
                $taskListingObj->setCondition('dueDate > ?',$toDateTime,'AND');
                $flag =true;
            }
        }
        $status = $request->get('status');
        
        if($status != ""){
            if ($flag == true){
                $taskListingObj->addConditionParam('status = ?',$status,'OR');
            }
            else {
                $taskListingObj->setCondition('status = ?',$status,'OR');
                $flag =true;
            }
            
        }
        $priority  =  $request->get('priority');
        if($priority != ""){
            if ($flag == true){
                $taskListingObj->addConditionParam('priority = ?',$priority,'OR');
            }
            else {
                $taskListingObj->setCondition('priority = ?',$priority,'OR');
                $flag =true;
            }
        }
                
        $totalCount = $taskListingObj->count();
        $taskListingData = $taskListingObj->load(); 
               $response = \GuzzleHttp\json_encode([
           "success" => true,
            'data' => $taskListingData,
            'total' => $totalCount]);
        
        return new Response($response);
       
    }
    
    /**
     * @param string|null $date
     * @param string|null $time
     *
     * @return \DateTime|null
     */
    private function parseDateTime($date = null, $time = null) {
       $dateTime = date('Y-m-d H:i:s', strtotime($date." ".$time));
       return $dateTime;
    }
    
    /**
     * Task Detail for specific id
     * 
     * @Route("/current_task_detail")
     * @param Request $request
     *
     * @return JsonResponse
     * 
    */
    public function currentTaskDetail(Request $request) {
        $id = $request->get('id');
        $taskListingObj = new Model\Tasks\Listing();
        $taskListingObj->setCondition("id = ?", $id)->setLimit(1);
        $taskDetail = $taskListingObj->load(); 
       
        $response = \GuzzleHttp\json_encode([
            'success'=>$taskDetail]);
        
        return new Response($response);
    }
    
       
    /** 
     * Update Task Detail for specific id
     * 
     * @Route("/update_task")
     * @param Request $request
     *
     * @return JsonResponse
     * 
    */
    public function updateTask(Request $request) {
        $id                =  $request->get('id');
        $description       =  $request->get('description');
        $dueDate           =  Carbon::createFromFormat('m/d/y g:ia', $request->get('dueDate')." ".$request->get('dueDateTime'));
        $priority          =  $request->get('priority');
        $status            =  $request->get('status'); 
        $startDate         =  Carbon::createFromFormat('m/d/y g:ia', $request->get('startDate')." ".$request->get('startDateTime'));
        $completionDate    =  Carbon::createFromFormat('m/d/y g:ia', $request->get('completionDate')." ".$request->get('completionDateTime'));
        $associatedElement =  $request->get('associatedElement');
        $subject           =  $request->get('subject');
        
        $tasksObj = new Model\Tasks();
        $tasksObj->setId($id);
        $tasksObj->setDescription($description);
        $tasksObj->setDueDate($dueDate);
        $tasksObj->setPriority($priority);
        $tasksObj->setStatus($status);
        $tasksObj->setStartDate($startDate);
        $tasksObj->setCompletionDate($completionDate);
        $tasksObj->setAssociatedElement($associatedElement);
        $tasksObj->setSubject($subject);
        $tasksObj->save();
    
        return $this->json(array('success' => 'updated'));
    }
    
    
    
    /**
     * Delete selected task
     * 
     * @Route("/delete_task")
     * @param Request $request
     *
     * @return JsonResponse
     * 
    */
    public function deleteTask(Request $request) {
        $id= json_decode($request->get('id'));
        
        $tasksObj = new Model\Tasks();
        for($i=0; $i<sizeof($id);$i++) {
            $tasksObj->setId($id[$i]);
            $tasksObj->delete();
        }
        
        return $this->json(array('success' => 'deleted'));
    }
    
    /**
     * Change status to completed task
     * 
     * @Route("/completed_task")
     * 
    */
    public function completedTask(Request $request) {
        $id= json_decode($request->get('id'));
        $taskManagmentObj = new Model\Tasks();
        for($i=0; $i<sizeof($id);$i++) {
            $taskManagmentObj->setId($id[$i]);
            $taskManagmentObj->setStatus('Completed');
            $taskManagmentObj->save();
        }
        return $this->json(array('success' => 'Status updated to completed'));
    }
}
