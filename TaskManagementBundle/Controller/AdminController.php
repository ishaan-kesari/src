<?php

/* 
 * TaskManagementBundle
 * 
 */

namespace TaskManagementBundle\Controller;

use Pimcore\Controller\FrontendController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use TaskManagementBundle\Model;
use \Pimcore\Model\DataObject;

/* 
 * Task Backend Controller
 * 
 * @method SaveTask(Request $request)
 * @method indexAction(Request $request)
 * 
 */
class AdminController extends FrontendController
{
    /**
     * @Route("/task_management__admin_index")
     */
    public function indexAction(Request $request) {}
    
    /**
     * @Route("/save_task")
     */
    public function SaveTask(Request $request)
    { 
        $Description       =  $_POST['description'];
        $DueDate           =  date('Y-m-d H:i:s', strtotime($_POST['due_date']." ".$_POST['due_date_time']));
        $Priority          =  $_POST['priority'];
        $Status            =  $_POST['status']; 
        $StartDate         =  date('Y-m-d H:i:s', strtotime($_POST['start_date']." ".$_POST['start_date_time']));
        $CompletionDate    =  date('Y-m-d H:i:s', strtotime($_POST['completion_date']." ".$_POST['completion_date_time']));
        $AssociatedElement =  $_POST['associated_element'];
        $Subject           =  $_POST['subject'];
     
        $TaskManagmentObj = new Model\TaskManagement();
        $TaskManagmentObj->setDescription($Description);
        $TaskManagmentObj->setDue_date($DueDate);
        $TaskManagmentObj->setPriority($Priority);
        $TaskManagmentObj->setStatus($Status);
        $TaskManagmentObj->setStart_date($StartDate);
        $TaskManagmentObj->setCompletion_date($CompletionDate);
        $TaskManagmentObj->setAssociated_element($AssociatedElement);
        $TaskManagmentObj->setSubject($Subject);
        $TaskManagmentObj->save();
        $response = \GuzzleHttp\json_encode([
            'success'=>'Added'
        ]);
        return new Response($response);
    }
    
    /**
     * @Route("/show_task_listing")
     */
    public function showAction(Request $request)
    {
        $start = $request->get('start');
        $limit = $request->get('limit');
     
        $TaskListingObj = new \TaskManagementBundle\Model\TaskManagement\Listing();
        $TaskListingObj->setOffset($start);
        $TaskListingObj->setLimit($limit);
        $totalCount = $TaskListingObj->count();
        $TaskListingData = $TaskListingObj->load(); 
        $response =  \GuzzleHttp\json_encode(["success" => true,
            'data' => $TaskListingData,
            'total' => $totalCount]);
        return new Response($response);
    }
       
    /** 
     * Update Task Detail for specific id
     * 
     * 
     * @Route("/update_task")
     * 
    */
    public function UpdateTask() {
        $id                = $_POST['id'];
        $Description       = $_POST['description'];
        $DueDate           = date('Y-m-d H:i:s', strtotime($_POST['due_date']." ".$_POST['due_date_time']));
        $Priority          = $_POST['priority'];
        $Status            = $_POST['status']; 
        $StartDate         = date('Y-m-d H:i:s', strtotime($_POST['start_date']." ".$_POST["due_date_time"]));
        $CompletionDate    = date('Y-m-d H:i:s', strtotime($_POST['completion_date']." ".$_POST["completion_date_time"]));
        $AssociatedElement = $_POST['associated_element'];
        $Subject           = $_POST['subject'];
        
        $TaskManagmentObj = new Model\TaskManagement();
        $TaskManagmentObj->setId($id);
        $TaskManagmentObj->setDescription($Description);
        $TaskManagmentObj->setDue_date($DueDate);
        $TaskManagmentObj->setPriority($Priority);
        $TaskManagmentObj->setStatus($Status);
        $TaskManagmentObj->setStart_date($StartDate);
        $TaskManagmentObj->setCompletion_date($CompletionDate);
        $TaskManagmentObj->setAssociated_element($AssociatedElement);
        $TaskManagmentObj->setSubject($Subject);
        $TaskManagmentObj->save();
        $response = \GuzzleHttp\json_encode([
            'success'=>'Updated'
        ]);
        return new Response($response);
    }
    
    /**
     * Task Detail for specific id
     * 
     * @Route("/current_task_detail")
     * @return array task detail
     * 
    */
    public function CurrentTaskDetail() {
        $id= $_GET['id'];
        $TaskListingObj = new \TaskManagementBundle\Model\TaskManagement\Listing();
        $TaskListingObj->setCondition("id = ?", $id)->setLimit(1);
        $TaskDetail = $TaskListingObj->load(); 
        $response = \GuzzleHttp\json_encode([
            'success'=>$TaskDetail
        ]);
        return new Response($response);
    }
    
    /**
     * Delete selected task
     * 
     * @Route("/delete_task")
     * 
    */
    public function DeleteTask() {
        $id= json_decode($_GET['id']);
        
        $TaskManagmentObj = new Model\TaskManagement();
        for($i=0; $i<sizeof($id);$i++) {
            $TaskManagmentObj->setId($id[$i]);
            $TaskManagmentObj->delete();
        }
        $response = \GuzzleHttp\json_encode([
            'success'=>'Deleted'
        ]);
        return new Response($response);
    }
    
    /**
     * Change status to completed task
     * 
     * @Route("/completed_task")
     * 
    */
    public function CompletedTask() {
        $id= json_decode($_GET['id']);
        $TaskManagmentObj = new Model\TaskManagement();
        for($i=0; $i<sizeof($id);$i++) {
            $TaskManagmentObj->setId($id[$i]);
            $TaskManagmentObj->setStatus('Completed');      
            $TaskManagmentObj->save();
        }
        $response = \GuzzleHttp\json_encode([
            'success'=>'Status updated to completed'
        ]);
        return new Response($response);
    }
}
