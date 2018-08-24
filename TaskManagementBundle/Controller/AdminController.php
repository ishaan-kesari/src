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
use Pimcore\File;

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
        $dueDate           =  Carbon::createFromFormat('m/d/y', $request->get('dueDate'));
        $priority          =  $request->get('priority');
        $status            =  $request->get('status');
        $startDate         =  Carbon::createFromFormat('m/d/y', $request->get('startDate'));
        if($request->get('completionDate') != '') {
            $completionDate    =  Carbon::createFromFormat('m/d/y', $request->get('completionDate')); 
        }
        $associatedElement =  $request->get('associatedElement');
        $subject           =  $request->get('subject');
     
        $tasksObj = new Model\Tasks();
        $tasksObj->setDescription($description);
        $tasksObj->setDueDate($dueDate);
        $tasksObj->setPriority($priority);
        $tasksObj->setStatus($status);
        $tasksObj->setStartDate($startDate);
        if($request->get('completionDate') != '') { 
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
            $taskListingObj->setCondition('subject LIKE ?','%'.$subject.'%', 'AND');
            $flag =true;
        }
        $fromDate = $request->get('fromDate');
        if ($fromDate != "") {
            $fromDate = $this->parseDateTime($fromDate);
            if ($flag == true){
                $taskListingObj->addConditionParam('startDate <= ?',$fromDate,'AND');
            }
            else {
                $taskListingObj->setCondition('startDate <= ?',$fromDate,'AND');
                $flag =true;
            }

        }
        $toDate = $request->get('toDate');
        if ($toDate != "") {
            $toDate = $this->parseDateTime($toDate);
            if ($flag == true){
                $taskListingObj->addConditionParam('dueDate > ?',$toDate,'AND');
            }
            else {
                $taskListingObj->setCondition('dueDate > ?',$toDate,'AND');
                $flag =true;
            }
        }
        $status = $request->get('status');
        
        if($status != ""){
            if ($flag == true){
                $taskListingObj->addConditionParam('status = ?',$status,'AND');
            }
            else {
                $taskListingObj->setCondition('status = ?',$status,'AND');
                $flag =true;
            }
            
        }
        $priority  =  $request->get('priority');
        if($priority != ""){
            if ($flag == true){
                $taskListingObj->addConditionParam('priority = ?',$priority,'AND');
            }
            else {
                $taskListingObj->setCondition('priority = ?',$priority,'AND');
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
    private function parseDateTime($date = null) {
       $dateTime = date('Y-m-d', strtotime($date));
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
        $dueDate           =  Carbon::createFromFormat('m/d/y', $request->get('dueDate'));
        $priority          =  $request->get('priority');
        $status            =  $request->get('status'); 
        $startDate         =  Carbon::createFromFormat('m/d/y', $request->get('startDate'));
        if($request->get('completionDate') != '' ) {  
            $completionDate    =  Carbon::createFromFormat('m/d/y', $request->get('completionDate')); 
        }
        $associatedElement =  $request->get('associatedElement');
        $subject           =  $request->get('subject');
        
        $tasksObj = new Model\Tasks();
        $tasksObj->setId($id);
        $tasksObj->setDescription($description);
        $tasksObj->setDueDate($dueDate);
        $tasksObj->setPriority($priority);
        $tasksObj->setStatus($status);
        $tasksObj->setStartDate($startDate);
        if($request->get('completionDate') != '' ) {  
            $tasksObj->setCompletionDate($completionDate);
        } 
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
    
    /**
     * @Route("/task_portlet");
     * @param Request $request
     */
    public function portletList(Request $request) {
       $taskListingObj = new Model\Tasks\Listing();
       $taskListingObj->setOrder('DESC');
       $taskListingObj->setLimit(10);
       $taskListingData = $taskListingObj->load(); 
               $response = \GuzzleHttp\json_encode([
                      'data' => $taskListingData]
           );
        
        return new Response($response);
    }
    
    /**
     * @Route("/settings_save");
     * @param Request $request
     */
    public function settingsSave(Request $request) {
        $a = "task_management_homepage:
    path:     /
    defaults: { _controller: TaskManagementBundle:Default:index }";
        
        $path = '../src/TaskManagementBundle/test1.yml';
        
        File::put($path, $a);
        return $this->json(array('success' => 'Settings Saved'));
    }
}
