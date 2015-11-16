<?php

namespace XVEngine\Bundle\TableBundle\Component\Table\Elements;

class Column implements \JsonSerializable
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
     * Column constructor.
     * @author Krzysztof Bednarczyk
     * @param string $id
     */
    public function __construct($id, $label = null)
    {
        $this->id = $id;
        $this->setLabel($label);
    }


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
        return [
            "id" => $this->id,
            "label" => $this->label,
        ];
    }
}