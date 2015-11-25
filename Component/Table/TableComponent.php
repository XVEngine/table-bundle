<?php

namespace XVEngine\Bundle\TableBundle\Component\Table;


use XVEngine\Bundle\TableBundle\Component\Table\Elements\Column;
use XVEngine\Bundle\TableBundle\Component\Table\Elements\Row;
use XVEngine\Core\Component\AbstractComponent;

/**
 * Class TableComponent
 * @author Krzysztof Bednarczyk
 * @package XVEngine\Bundle\TableBundle\Component\Table
 */
class TableComponent extends AbstractComponent {



    const onDblClickRow = "onDblClickRow";
    const onCellFocusChange = "onCellFocusChange";

    /**
     * @var Column[]
     */
    protected $columns = [];

    /**
     * @var Row[]
     */
    protected $rows = [];

    /*
     *
     */
    public function initialize() {
        $this->setComponentName('table.tableComponent');
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param Column $column
     * @return $this
     */
    public function addColumn(Column $column){
        $this->columns[$column->getId()] = $column;

        return $this;
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param Column $column
     * @return $this
     */
    public function setColumns($columns){
        $this->columns = [];
        foreach($columns as $column){
            $this->addColumn($column);
        }

        return $this;
    }

    /**
     * @author Krzysztof Bednarczyk
     * @param string $id
     * @return null|Column
     */
    public function getColumn($id){
        return isset($this->columns[$id]) ? $this->columns[$id] : null;
    }

    /**
     * @author Krzysztof Bednarczyk
     * @param Row $row
     * @return $this
     */
    public function addRow(Row $row){
        $this->rows[$row->getId()] = $row;

        return $this;
    }

    /**
     * @author Krzysztof Bednarczyk
     * @param string $id
     * @return null|Row
     */
    public function getRow($id){
        return isset($this->rows[$id]) ? $this->rows[$id] : null;
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param AbstractComponent $footer
     * @return $this
     */
    public function setFooterComponent(AbstractComponent $footer){
        return $this->setParam("footerComponent", $footer);
    }


    /**
     * @author Krzysztof Bednarczyk
     * @return array
     */
    public function jsonSerialize() {
        $this->setParam("columns", array_values($this->columns));
        $this->setParam("rows", array_values($this->rows));
        return parent::jsonSerialize();
    }

}
