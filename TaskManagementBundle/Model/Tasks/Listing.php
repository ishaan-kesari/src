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
 */
namespace TaskManagementBundle\Model\Tasks;
 
use Pimcore\Model;
use Zend\Paginator\Adapter\AdapterInterface;
use Zend\Paginator\AdapterAggregateInterface;
 
class Listing extends Model\Listing\AbstractListing implements \Zend_Paginator_Adapter_Interface, \Zend_Paginator_AdapterAggregate, \Iterator, AdapterInterface, AdapterAggregateInterface
{
    /**
     * List of Tasks.
     *
     * @var array
    */
    public $data = null;
 
    /**
     * @var string|\Zend_Locale
     */
    public $locale;
 
    /**
     * List of valid order keys.
     *
     * @var array
     */
    public $validOrderKeys = array(
        'id'
    );
 
    /**
     * Test if the passed key is valid.
     *
     * @param string $key
     *
     * @return bool
     */
    public function isValidOrderKey($key)
    {
        return in_array($key, $this->validOrderKeys);
    }
 
    /**
     * @return array
     */
    public function getData()
    {
        if ($this->data === null) {
            $this->load();
        }
 
        return $this->data;
    }
 
    /**
     * @param array $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }
 
    /**
     * Methods for \Zend_Paginator_Adapter_Interface.
     */
 
    /**
     * get total count.
     *
     * @return mixed
     */
    public function count()
    {
        return $this->getTotalCount();
    }
 
    /**
     * get all items.
     *
     * @param int $offset
     * @param int $itemCountPerPage
     *
     * @return mixed
     */
    public function getItems($offset, $itemCountPerPage)
    {
        $this->setOffset($offset);
        $this->setLimit($itemCountPerPage);
 
        return $this->load();
    }
 
    /**
     * Get Paginator Adapter.
     *
     * @return $this
     */
    public function getPaginatorAdapter()
    {
        return $this;
    }
 
    /**
     * Set Locale.
     *
     * @param mixed $locale
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;
    }
 
    /**
     * Get Locale.
     *
     * @return string|\Zend_Locale
     */
    public function getLocale()
    {
        return $this->locale;
    }
     
    /**
     * Methods for Iterator.
     */
 
    /**
     * Rewind.
     */
    public function rewind()
    {
        $this->getData();
        reset($this->data);
    }
 
    /**
     * current.
     *
     * @return mixed
     */
    public function current()
    {
        $this->getData();
        $var = current($this->data);
 
        return $var;
    }
 
    /**
     * key.
     *
     * @return mixed
     */
    public function key()
    {
        $this->getData();
        $var = key($this->data);
 
        return $var;
    }
 
    /**
     * next.
     *
     * @return mixed
     */
    public function next()
    {
        $this->getData();
        $var = next($this->data);
 
        return $var;
    }
 
    /**
     * valid.
     *
     * @return bool
     */
    public function valid()
    {
        $this->getData();
        $var = $this->current() !== false;
 
        return $var;
    }
}