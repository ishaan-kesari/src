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
        $Description =$_POST['description'];
        $DueDate = date('Y-m-d H:i:s', strtotime($_POST['due_date']));
        $Priority =  $_POST['priority'];
        $Status = $_POST['status']; 
        $StartDate = date('Y-m-d H:i:s', strtotime($_POST['start_date']));
        $CompletionDate =  date('Y-m-d H:i:s', strtotime($_POST['completion_date']));
        $AssociatedElement =  $_POST['associated_element'];
        $Subject = $_POST['subject'];
     
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
        die;
        
       
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
        //$TaskListingObj->setCondition('column = 1 AND column2 = 2');
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
        $id= $_POST['id'];
        $Description =$_POST['description'];
        $DueDate = date('Y-m-d H:i:s', strtotime($_POST['due_date']));
        $Priority =  $_POST['priority'];
        $Status = $_POST['status']; 
        $StartDate = date('Y-m-d H:i:s', strtotime($_POST['start_date']));
        $CompletionDate =  date('Y-m-d H:i:s', strtotime($_POST['completion_date']));
        $AssociatedElement =  $_POST['associated_element'];
        $Subject = $_POST['subject'];
        
        
        
        
        //$TaskManagmentObj = new Model\TaskManagement();
        die;
    }
    
    
    /**
     * Task Detail for specific id
     * 
     * @Route("/edit_task")
     * @return array task detail
     * 
    */
    public function EditTask() {
        $id= $_GET['id'];
        $TaskListingObj = new \TaskManagementBundle\Model\TaskManagement\Listing();
        $TaskListingObj->setCondition("id = ?", $id)->setLimit(1);
        $TaskDetail = $TaskListingObj->load(); 
       
        $response = \GuzzleHttp\json_encode([
            'success'=>$TaskDetail
        ]);
        
        return new Response($response);
        die;
    }
    
    
}
