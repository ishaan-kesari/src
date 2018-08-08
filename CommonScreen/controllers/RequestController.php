<?php

class CommonScreen_RequestController extends \Pimcore\Controller\Action\Admin {



    public function getAllNpiAction() {

        $showAll = $this->getParam('showOpt');
        $start = $this->getParam("start");
        $limit = $this->getParam("limit");
        $page = $this->getParam("page");
        $start = ($page-1)*$limit;
        $currentUser = \Pimcore\Tool\Admin::getCurrentUser();
        $userName = $currentUser->getUsername();

        $db = \Pimcore_Resource_Mysql::get();
        if($showAll == 1) {
          //  $select = "select o_id,o_key as keyname,o_key as NPI_Name,DATE_FORMAT(FROM_UNIXTIME(o_CreationDate), '%e %b %Y') as Initiation_Date,st.status as NPI_Status from object_17 join element_workflow_state st on st.cid = object_17.o_id where object_17.o_path IN ('/NPI/','/NPI/cancelled/') limit ".$start.",".$limit;
            $select = "select object_17.o_id,object_17.o_key as NPI_Name,DATE_FORMAT(FROM_UNIXTIME(object_17.o_CreationDate), '%e %b %Y') as Initiation_Date,object_17.NPIType as NPI_Type,Brand.Name as Brand,pg.Name as Product_Group,Pattern.Name as Pattern,site.name as site, concat(user.firstname,' ',user.lastname) as project_owner,st.status as NPI_Status from object_17 join element_workflow_state st on st.cid = object_17.o_id join object_1 Brand on Brand.o_id = object_17.Brand__id join object_4 pg on pg.o_id = object_17.ProductGroup__id left join object_3 Pattern on Pattern.o_id = object_17.Pattern__id join object_6 site on site.o_id = PPS__id join users user on user.id = object_17.projectowner where st.status NOT IN ('published','completed') limit ".$start.",".$limit;
           
            $totalRecords =  "select count(*) as total from object_17 join element_workflow_state st on st.cid = object_17.o_id join object_1 Brand on Brand.o_id = object_17.Brand__id join object_4 pg on pg.o_id = object_17.ProductGroup__id left join object_3 Pattern on Pattern.o_id = object_17.Pattern__id join object_6 site on site.o_id = PPS__id join users user on user.id = object_17.o_userOwner where object_17.o_path IN ('/NPI/','/NPI/cancelled/')";
           
       } else {
          //  $whereCondition = " element_workflow_state.status NOT IN ('draft','closed','cancelled','rejected') ";
            //TODO : currently it is showing status from workflow info table
            //need to change this from workflow state table
            //change subquery to inner join
            $select = "select object_17.o_id,object_17.o_key as NPI_Name,DATE_FORMAT(FROM_UNIXTIME(object_17.o_CreationDate), '%e %b %Y') as Initiation_Date,object_17.NPIType as NPI_Type,Brand.Name as Brand,pg.Name as Product_Group,Pattern.Name as Pattern,site.name as site, concat(user.firstname,' ',user.lastname) as project_owner,st.status as NPI_Status from object_17 join element_workflow_state st on st.cid = object_17.o_id join object_1 Brand on Brand.o_id = object_17.Brand__id join object_4 pg on pg.o_id = object_17.ProductGroup__id left join object_3 Pattern on Pattern.o_id = object_17.Pattern__id join object_6 site on site.o_id = PPS__id join users user on user.id = object_17.projectowner where st.status NOT IN ('published','cancelled','completed') limit ".$start.",".$limit;
            
            $totalRecords =  "select count(*) as total from object_17 join element_workflow_state st on st.cid = object_17.o_id join object_1 Brand on Brand.o_id = object_17.Brand__id join object_4 pg on pg.o_id = object_17.ProductGroup__id left join object_3 Pattern on Pattern.o_id = object_17.Pattern__id join object_6 site on site.o_id = PPS__id join users user on user.id = object_17.o_userOwner where object_17.o_path = '/NPI/'";
           /* $select = "select 
                po.o_key as keyname, u.name as Initiator_Name ,object_3.deptName as Department,DATE_FORMAT(FROM_UNIXTIME(po.orderDate), '%e %b %Y') as Order_Date, 
                object_5.projectName as Project_Name,po.currentDemand as Demand, wf1.status as Current_Status 
                from object_16 po 
                inner join workflow_info wf1 on po.oo_id = wf1.PO_id 
                AND wf1.userId= ".$currentUser->getId()." left join workflow_info wf2 on po.oo_id = wf2.PO_id 
                and wf2.userType='Initiator' 
                join users u on u.id = wf2.userId join object_3 on 
                po.department__id = object_3.oo_id join object_5 on po.project__id = object_5.oo_id and po.oo_id not
                in ( select cid from element_workflow_state where $whereCondition) limit ".$start.",".$limit;

            $totalRecords =  "select 
                    count(*) as total
                    from object_16 po 
                    inner join workflow_info wf1 on po.oo_id = wf1.PO_id 
                    AND wf1.userId= ".$currentUser->getId()."
                    and po.oo_id not
                    in ( select cid from element_workflow_state where $whereCondition)";*/
            }

           

        $stmt = $db->query($select);
        $rows = $stmt->fetchAll();
        $totalStmt = $db->query($totalRecords);
        $totalRows = $totalStmt->fetch();
      
        $this->_helper->json(array(
            "success" => true,
            'data' => $rows,
            'total' => $totalRows['total'],
            
        ));
    }

   

}
