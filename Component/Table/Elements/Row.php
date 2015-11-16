<?php

namespace XVEngine\Bundle\TableBundle\Component\Table\Elements;

/**
 * Class Row
 * @author Krzysztof Bednarczyk
 * @package XVEngine\Bundle\TableBundle\Component\Elements
 */
class Row implements \JsonSerializable
{

    /**
     * @var string
     */
    protected $id;


    /**
     * @var string[]
     */
    protected $values = [];

    /**
     * Column constructor.
     * @author Krzysztof Bednarczyk
     * @param string $id
     */
    public function __construct($id, $label = null)
    {
        $this->id = $id;
    }

    /**
     * Get id value
     * @author Krzysztof Bednarczyk
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param Column|string $column Column or column id
     * @param mixed $value
     * @return $this
     */
    public function setValue($column, $value){
        if($column instanceof Column){
            $column = $column->getId();
        }

        $this->values[$column] = $value;
        return $this;
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param Column|string $column Column or column id
     * @return null|string
     */
    public function getValue($column){
        if($column instanceof Column){
            $column = $column->getId();
        }

        return isset($this->values[$column]) ? $this->values[$column]  : null;
    }


    /**
     * @author Krzysztof Bednarczyk
     * @return string[]
     */
    public function getValues(){
        return $this->values;
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
            "id" => $this->getId(),
            "values" => $this->getValues()
        ];
    }
}