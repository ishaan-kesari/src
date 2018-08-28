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
 * 
 */

namespace TaskManagementBundle\Controller;

use Pimcore\Controller\FrontendController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use TaskManagementBundle\Model;
use \Pimcore\Model\DataObject;
use Carbon\Carbon;
use Pimcore\File;
use Pimcore\Mail;

/**
* @Route("/admin")
*/
class TasksController extends FrontendController {

    /**
     * @Route("/tasks/task-management-admin-index")
     */
    public function indexAction(Request $request) {
        
    }

    /**
     * @Route("/tasks/save")
     */
    public function save(Request $request) {
        $userId = 0;
        $user = \Pimcore\Tool\Admin::getCurrentUser();
        if ($user) {
            $userId = $user->getId();
        }
        
        if($request->get('edit') == true) {
            $id = $request->get('id');
        }
        $description = $request->get('description');
        $dueDate = Carbon::createFromFormat('m/d/y', $request->get('dueDate'));
        $priority = $request->get('priority');
        $status = $request->get('status');
        $startDate = Carbon::createFromFormat('m/d/y', $request->get('startDate'));
        if ($request->get('completionDate') != '') {
            $completionDate = Carbon::createFromFormat('m/d/y', $request->get('completionDate'));
        }
        $associatedElement = $request->get('associatedElement');
        $subject = $request->get('subject');

        $tasksObj = new Model\Tasks();
        
        if($request->get('edit') == true) {
            $tasksObj->setId($id);
        }
        
        $tasksObj->setDescription($description);
        $tasksObj->setDueDate($dueDate);
        $tasksObj->setPriority($priority);
        $tasksObj->setStatus($status);
        $tasksObj->setStartDate($startDate);
        if ($request->get('completionDate') != '') {
            $tasksObj->setCompletionDate($completionDate);
        }
        $tasksObj->setAssociatedElement($associatedElement);
        $tasksObj->setSubject($subject);
        $tasksObj->setUserOwner($userId);
        $tasksObj->save();

        return $this->json(array('success' => 'true'));

    }

    
    
    /**
     * @Route("/tasks/listing")
     * 
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function listing(Request $request) {
        $start = $request->get('start');
        $limit = $request->get('limit');

        $taskListingObj = new Model\Tasks\Listing();
        $taskListingObj->setOffset($start);
        $taskListingObj->setLimit($limit);

        $subject = $request->get('subject');
        $fromDate = $request->get('fromDate');
        $toDate = $request->get('toDate');
        $status = $request->get('status');
        $priority = $request->get('priority');
        
        $flag = false;
        if ($subject != "") {
            $taskListingObj->setCondition('subject LIKE ?', '%' . $subject . '%', 'AND');
            $flag = true;
        }
        if ($fromDate != "") {
            $fromDate = $this->parseDateTime($fromDate);
            if ($flag == true) {
                $taskListingObj->addConditionParam('startDate <= ?', $fromDate, 'AND');
            } else {
                $taskListingObj->setCondition('startDate <= ?', $fromDate, 'AND');
                $flag = true;
            }
        }
        
        if ($toDate != "") {
            $toDate = $this->parseDateTime($toDate);
            if ($flag == true) {
                $taskListingObj->addConditionParam('dueDate > ?', $toDate, 'AND');
            } else {
                $taskListingObj->setCondition('dueDate > ?', $toDate, 'AND');
                $flag = true;
            }
        }

        if ($status != "") {
            if ($flag == true) {
                $taskListingObj->addConditionParam('status = ?', $status, 'AND');
            } else {
                $taskListingObj->setCondition('status = ?', $status, 'AND');
                $flag = true;
            }
        }
        
        if ($priority != "") {
            if ($flag == true) {
                $taskListingObj->addConditionParam('priority = ?', $priority, 'AND');
            } else {
                $taskListingObj->setCondition('priority = ?', $priority, 'AND');
                $flag = true;
            }
        }

        $totalCount = $taskListingObj->count();
        $taskListingData = $taskListingObj->load();
        //$listingData = ;
        foreach($taskListingData as $task ){
            $listingData = $task;
        }
        
        p_r($taskListingData);
        die;
        return $this->json(array('success' => 'true','data' => $listingData,'total' => $totalCount));
//        return $this->json(
//                            [
//            "success" => true,
//            'data' => $taskListingData,
//            'total' => $totalCount]
//            );
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
     * @Route("/tasks/current-task-detail")
     * @param Request $request
     *
     * @return JsonResponse
     * 
    */
    public function viewTask(Request $request) {
        $id = $request->get('id');
        $taskListingObj = new Model\Tasks\Listing();
        $taskListingObj->setCondition("id = ?", $id)->setLimit(1);
        $taskDetail = $taskListingObj->load();

        $response = \GuzzleHttp\json_encode([
            'success' => $taskDetail]);

        return new Response($response);
    }

       /**
     * Delete selected task
     * 
     * @Route("/tasks/delete")
     * @param Request $request
     *
     * @return JsonResponse
     * 
     */
    public function deleteTask(Request $request) {
        $id = json_decode($request->get('id'));

        $tasksObj = new Model\Tasks();
        for ($i = 0; $i < sizeof($id); $i++) {
            $tasksObj->setId($id[$i]);
            $tasksObj->delete();
        }
        
        return $this->json(array('success' => 'true'));
    }

    /**
     * Change status to completed task
     * 
     * @Route("/tasks/completed-task")
     * 
    */
    public function updateStatus(Request $request) {
        $id= json_decode($request->get('id'));
        $taskManagmentObj = new Model\Tasks();
        for ($i = 0; $i < sizeof($id); $i++) {
            $taskManagmentObj->setId($id[$i]);
            $taskManagmentObj->setStatus('Completed');
            $taskManagmentObj->save();
        }
        return $this->json(array('success' => 'true'));
    }

    /**
     * @Route("/tasks/portlet");
     * @param Request $request
     */
    public function portletList(Request $request) {
       $status  = "Completed";
       $taskListingObj = new Model\Tasks\Listing();
       $taskListingObj->addConditionParam("status != ?",$status, 'AND');
       $taskListingObj->setOrder('DESC');
       $taskListingObj->setLimit(10);
       $taskListingData = $taskListingObj->load(); 
               $response = \GuzzleHttp\json_encode([
                      'data' => $taskListingData]
           );
        return new Response($response);
    }

    /**
     * @Route("/tasks/settings-save");
     * @param Request $request
     */
    public function saveConfiguration(Request $request) {
        $data = $request->get("data");
        $data =   str_replace("&","
         ",$data);
        $path = '../Resources/config/taskManagement.yml';
        File::put($path, $data);
        return $this->json(array('success' => 'true'));
    }

}
