(function(namespace, app, globals) {


    namespace.tableComponent = app.newClass({
        extend: function () {
            return app.core.component.abstractComponent;
        }
    });


    /**
     *
     * @returns {$}
     */
    namespace.tableComponent.prototype.getTemplate = function() {
        var tmplString = app.utils.getString(function() {
            //@formatter:off
            /**<string>
                    <xv-table class='event-resize'>
                        <div>
                            <div class='wrapper'>
                                <table>
                                    <colgroup></colgroup>
                                    <thead>
                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                        </div>
                    </xv-table>
             </string>*/
            //@formatter:on
        });
        return $(tmplString);
    };


    /**
     *
     * @returns {object}
     */
    namespace.tableComponent.prototype.getDefaultParams = function() {
        return {
            "rows" : [],
            "columns": []
        };
    };


    /**
     *
     * @returns {undefined}
     */
    namespace.tableComponent.prototype.init = function() {
        this.$wrapper = this.$element.find(".wrapper");
        this.$table = this.$element.find("table");
        this.$colgroup = this.$table.find("colgroup");
        this.$thead = this.$table.find("thead");
        this.$tbody = this.$table.find("tbody");
        this.$tfoot = this.$table.find("tfoot");
        this._rows = [];
        this._columns = [];
        this._$lastFocus = null;

        this.$wrapper.perfectScrollbar();

        this.setColumns(this.params.columns);
        this.setRows(this.params.rows);

        this.initEvents();
    };


    /**
     *
     */
    namespace.tableComponent.prototype.initEvents = function() {
        var self = this;
        this.$tbody.on("mouseleave", function(){
            self.$colgroup.find("col.hover").removeClass("hover");
        });

        this.$tbody.on("mouseenter", "> tr > td",  function(){
            self.$colgroup.find("col.hover").removeClass("hover");
            self.$colgroup.find("col").eq($(this).index()).addClass("hover");
        });

        this.$tbody.on("dblclick", "> tr > td",  function(){
            var $this = $(this);

            if($this.is(".dblclick")){
                return;
            }

            self._$lastDblClick && self._$lastDblClick.removeClass("dblclick");
            self._$lastDblClick = $this;
            $this.addClass("dblclick");

            self.setLastDblClickRow({
               "id" : $this.attr('data-row-id'),
               "column" : $this.attr('data-column-id')
            });

            self.trigger("onDblClickRow");
        });

        this.$tbody.on("click", "> tr > td",  function(){
            var $this = $(this);
            self._$lastFocus && self._$lastFocus.removeClass("focus");
            $this.addClass("focus");
            if(!$this.is(self._$lastFocus)){
                self._$lastFocus && self._$lastFocus.removeClass("dblclick");
                self._$lastFocus = $this;
                self.trigger("onCellFocusChange");
            }

            return this;
        });

        this.$element.on("event-resize",  function(){
            self.$wrapper.perfectScrollbar("update");
            return this;
        });

    };


    /**
     *
     */
    namespace.tableComponent.prototype.setLastDblClickRow = function(obj) {
        this._lastDblClickRow = obj;
        return this;
    };

    /**
     *
     */
    namespace.tableComponent.prototype.getLastDblClickRow = function() {
        return app.utils.ifsetor(this._lastDblClickRow, null);
    };




    /**
     *
     */
    namespace.tableComponent.prototype.setColumns = function(columns) {
        var self = this;
        this.clearColumns();
        columns.forEach(function(column){
            self.addColumn(column);
        });


        this.render();
        return this;
    };


    /**
     *
     */
    namespace.tableComponent.prototype.addColumn = function(column) {
        this._columns.push(column);
        this.render();
        return this;
    };


    /**
     *
     */
    namespace.tableComponent.prototype.setRows = function(rows) {
        var self = this;
        this.clearRows();
        rows.forEach(function(row){
            self.addRow(row);
        });


        this.render();
        return this;
    };

    /**
     *
     */
    namespace.tableComponent.prototype.addRow = function(row) {
        this._rows.push(row);
        this.render();
        return this;
    };


    /**
     *
     */
    namespace.tableComponent.prototype.setCellValue = function(rowId, columnId, value) {
        var row;

        for(var i = 0; i < this._rows.length; i++){
            if(this._rows[i].id != rowId){
                continue;
            }

            row = this._rows[i];
            row.values[columnId] = value;
            row.cache[columnId] = $("<div>").html(value);
            break;
        }

        if(!row){
            return this;
        }

        this.$tbody.find(".row-"+rowId).find(".column-"+columnId).html(row.cache[columnId]);
        return this;
    };


    /**
     *
     */
    namespace.tableComponent.prototype.render = function() {
        clearTimeout(this._renderTimeout);
        var self = this;
        this._renderTimeout = setTimeout(function(){
            self._render();
        }, 40);

        return this;
    };


    /**
     *
     */
    namespace.tableComponent.prototype._render = function() {
        var i, row, x, column, $tr, $td, $col;

        /** RENDER HEADERS **/
        this.$thead.html("");
        $tr = $("<tr>");


        for(i = 0; i < this._columns.length; i++){
            column = this._columns[i];

            $col = $("<col>");
            $col.attr("id", column.id);
            this.$colgroup.append($col);


            $td = $("<th>");
            $td.append($("<div>").html(column.label));
            $tr.append($td);
        }
        this.$thead.append($tr);




        /** RENDER ROWS **/
        this.$tbody.html("");

        for(i = 0; i < this._rows.length; i++){
            row = this._rows[i];
            $tr = $("<tr>");
            $tr.addClass("row-"+ row.id);
            $tr.attr("data-id", row.id);
            !row.cache && (row.cache  = {});

            for(x = 0; x < this._columns.length; x++){
                $td = $("<td>");
                column = this._columns[x];



                if(!row.cache[column.id]){
                    value = typeof row.values[column.id] === "undefined" ?  "" : row.values[column.id];
                    row.cache[column.id] = $("<div>").html(value);
                }


                $td.addClass("column-" + column.id);
                $td.attr("data-column-label", column.label);
                $td.attr("data-column-id", column.id);
                $td.attr("data-row-id", row.id);
                $td.append(row.cache[column.id]);
                $tr.append($td);
            }

            this.$tbody.append($tr);
        }



    };

    /**
     *
     */
    namespace.tableComponent.prototype.clearRows = function() {
        this._rows = [];
        this.$tbody.html("");
        return this;

    };

    /**
     *
     */
    namespace.tableComponent.prototype.clearColumns = function() {
        this._columns = [];
        this.$thead.find("> tr").html("");
        this.$colgroup.html("");
        return this;
    };


    namespace.tableComponent.prototype.refreshHeader = function(){

    };


    return namespace.tableComponent;
})(__ARGUMENT_LIST__);