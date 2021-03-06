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
                    <xv-table class='event-resize event-insert'>
                        <div class='sticky-header'></div>
                        <div class='pre-wrapper'>
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
                        <footer class='event-resize'>
                            <div></div>
                        </footer>
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
        this.$preWrapper = this.$element.find(".pre-wrapper");
        this.$wrapper = this.$element.find(".wrapper");
        this.$stickyHeader = this.$element.find(".sticky-header");
        this.$table = this.$element.find("table");
        this.$colgroup = this.$table.find("colgroup");
        this.$thead = this.$table.find("thead");
        this.$tbody = this.$table.find("tbody");
        this.$tfoot = this.$table.find("tfoot");

        this.$footer = this.$element.find("> footer");

        this._rows = [];
        this._columns = [];
        this._$lastFocus = null;

        this.$wrapper.perfectScrollbar();
        this._lastDblClickRow = null;
        this.setColumns(this.params.columns);
        this.setRows(this.params.rows);

        this.params.footerComponent && this.setFooterComponent(this.params.footerComponent);


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


        this.$tbody.on("click", ".table-checkbox", function(){
            $(this).toggleClass("checked");
            return false;
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
            self._$lastFocus && self._$lastFocus.removeClass("focus") && self._$lastFocus.parent().removeClass("focus");

            $this.addClass("focus") && $this.parent().addClass("focus");

            if(!$this.is(self._$lastFocus)){
                self._$lastFocus && self._$lastFocus.removeClass("dblclick");
                self._$lastFocus = $this;
                self.trigger("onCellFocusChange");
            }

            return this;
        });

        this.$element.on("event-resize",  function(){
            self.$wrapper.perfectScrollbar("update");
            self.refreshHeader();
            return this;
        });

        this.$element.on("event-insert",  function(){
            self.$wrapper.perfectScrollbar("update");
            self.refreshHeader();
            return this;
        });


        this.$wrapper.on('ps-scroll-x', function () {
            self.updateHeaderPosition();
        });

        this.$footer.on("event-resize", function(){
            self.$preWrapper.css('bottom', self.$footer.outerHeight(true)+"px");
            self.$wrapper.perfectScrollbar("update");
        });

        this._interval = setInterval(function(){
            self.updateHeaderPosition();
        }, 200);
    };


    /**
     *
     */
    namespace.tableComponent.prototype.updateHeaderPosition = function(obj) {

        var stickyScrollLeft = this.$stickyHeader.scrollLeft();
        var wrapperScrollLeft = this.$wrapper.scrollLeft();
        if(stickyScrollLeft !== wrapperScrollLeft){
            this.$stickyHeader.scrollLeft(wrapperScrollLeft);
        }

        return this;
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
    namespace.tableComponent.prototype.getLastDblClickRow = function(property) {
        if(!this._lastDblClickRow){
            return null;
        }

        if(property){
            return this._lastDblClickRow[property];
        }

        return this._lastDblClickRow;
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
        console.log("render");

        /** RENDER HEADERS **/
        this.$thead.html("");
        this.$stickyHeader.html("");
        $tr = $("<tr>");


        for(i = 0; i < this._columns.length; i++){
            column = this._columns[i];

            $col = $("<col>");
            $col.attr("id", column.id);
            this.$colgroup.append($col);


            $td = $("<th>");
            column.$cache = $("<div>").html($("<div>").addClass("table-th-style").html(column.label));

            $td.append(column.$cache);
            $tr.append($td);

            column.$td = $td;
            column.$tdSticky = $td.clone();
            this.$stickyHeader.append(column.$tdSticky);
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
                $tr.append(this._renderCell(this._columns[x], row));
            }

            this.$tbody.append($tr);
        }


        this.refreshHeader();
    };


    /**
     *
     */
    namespace.tableComponent.prototype._renderCell = function(column, row) {
        var $td = $("<td>");


        if(!row.cache[column.id]){
            value = typeof row.values[column.id] === "undefined" ?  "" : row.values[column.id];

            var $cache = $("<div>");

            if(column.checkbox){
                $td.data("checkbox-value", value);
                value = '';
            }
            row.cache[column.id] = $cache.html(value);
        }

        if(column.checkbox){
            $td.addClass("table-checkbox");
        }

        $td.addClass("column-" + column.id);
        $td.attr("data-column-label", column.label);
        $td.attr("data-column-id", column.id);
        $td.attr("data-row-id", row.id);
        $td.append(row.cache[column.id]);
        return $td;
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
        this.$stickyHeader.html("");
        this.$colgroup.html("");
        return this;
    };


    namespace.tableComponent.prototype.refreshHeader = function(){
        console.log("refresh header");
        for(var i = 0; i < this._columns.length; i++) {
            column = this._columns[i];
            if(!column.$td) continue;


            column.$tdSticky.css({
                "width" : column.$td.outerWidth()
            });
        }

        this.$preWrapper.css("top", this.$stickyHeader.outerHeight());
        this.updateHeaderPosition();
        return true;
    };

    namespace.tableComponent.prototype.onDestroy = function(){
        clearInterval(this._interval);
    };



    namespace.tableComponent.prototype.setFooterComponent = function(component){
        var self = this;
        return app.utils.buildComponent(component).then(function($html){
            self.$footer.find("> div").html($html);
            return true;
        });
    };


    return namespace.tableComponent;
})(__ARGUMENT_LIST__);