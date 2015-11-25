<?php

namespace XVEngine\Bundle\TableBundle\Component\Table\Elements;

class ColumnCheckbox extends  Column
{

    /**
     * @var string
     */
    protected $id;

    /**
     * @var string
     */
    protected $label;



    /**
     * Get id value
     * @author Krzysztof Bednarczyk
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set label value
     * @author Krzysztof Bednarczyk
     * @param string $label
     * @return  $this
     */
    public function setLabel($label)
    {
        $this->label = $label;
        return $this;
    }













    /**
     * Specify data which should be serialized to JSON
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    function jsonSerialize()
    {
        $data = parent::jsonSerialize();
        $data['checkbox'] = true;

        return $data;
    }
}