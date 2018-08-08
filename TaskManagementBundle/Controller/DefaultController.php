<?php

namespace TaskManagementBundle\Controller;

use Pimcore\Controller\FrontendController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use TaskManagementBundle\Model;


class DefaultController extends FrontendController
{
    /**
     * @Route("/task_management")
     */
    public function indexAction(Request $request)
    {
        return new Response('Task saved successfully');
    }
}
