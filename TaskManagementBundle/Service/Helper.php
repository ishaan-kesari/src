<?php

namespace TaskManagementBundle\Service;

class Helper {

    /**
     * 
     * @param type $taskListingData
     * @return type
     */
    public function dataInArray ($taskListingData){
        $listingData = [];
        foreach($taskListingData as $key =>$task ){
            $listingData[$key]['id'] = $task->id;
            $listingData[$key]['description'] = $task->description;
            $listingData[$key]['dueDate'] = $task->dueDate;
            $listingData[$key]['priority'] = $task->priority;
            $listingData[$key]['status'] = $task->status;
            $listingData[$key]['startDate'] = $task->startDate;
            $listingData[$key]['completionDate'] = $task->completionDate;
            $listingData[$key]['associatedElement'] = $task->associatedElement;
            $listingData[$key]['subject'] = $task->subject;
            $listingData[$key]['userOwner'] = $task->userOwner;
        }
        return $listingData;
    }
    /**
     * @param string|null $date
     * @param string|null $time
     *
     * @return \DateTime|null
     */
    public function parseDateTime($date = null) {
        $dateTime = date('Y-m-d', strtotime($date));
        return $dateTime;
    }
    
}
