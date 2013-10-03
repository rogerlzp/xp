module api_grid {
    export interface GridOptions extends Slick.GridOptions<any> {
        hideColumnHeaders?:boolean;
        width?:number;
        height?:number;
    }

    export interface GridColumn extends Slick.Column<any> {

    }

    export class Grid extends api_dom.DivEl {

        private defaultHeight = 400;
        private defaultWidth = 800;
        private data:any[];
        private columns:Slick.Column[];
        private slickGrid:Slick.Grid<any>;
        private options:GridOptions;
        private dataView:DataView;

        constructor(data:any, columns:GridColumn[], options?:GridOptions) {
            super("Grid");
            this.addClass("grid");

            this.data = data;
            this.columns = columns;
            this.options = options ? options : {};

            this.getEl().setHeight((this.options.height ? this.options.height : this.defaultHeight) + "px");
            this.getEl().setWidth((this.options.width ? this.options.width : this.defaultWidth) + "px");
            this.dataView = new DataView(this);
            this.slickGrid = new Slick.Grid(this.getHTMLElement(), this.dataView.slick(), this.columns, this.options);

        }

        setFilter(f:(item:any, args:any) => boolean) {
            this.dataView.setFilter(f);
        }


        afterRender() {
            if (this.options) {
                if (this.options.hideColumnHeaders) {
                    jQuery(".slick-header-columns").css("height", "0px");
                }
            }
            this.dataView.setItems(this.data);
        }

        setData(data:any) {
            this.data = data;
        }

        updateData(data:any) {
            this.data = data;
            this.dataView.setItems(data);
            this.dataView.refresh();
        }

        getDataView():DataView {
            return this.dataView;
        }

        render() {
            this.slickGrid.render();
        }

        resizeCanvas() {
            this.slickGrid.resizeCanvas();
        }

        updateRowCount() {
            this.slickGrid.updateRowCount();
        }

        invalidateRows(rows:number[]) {
            this.slickGrid.invalidateRows(rows);
        }

        setOnClick() {
            this.slickGrid.onClick.subscribe((event, data) => {
                //TODO: Continue here, even tho its hacky...
                //TODO: find out why this is called twice?
                console.log(jQuery(this.slickGrid.getCellNode(data.row, data.cell)).children('div').data("live-edit-key"));
            });
        }

        setSelectionModel(selectionModel: any) {
            this.slickGrid.setSelectionModel(selectionModel);
        }

        resetActiveCell() {
            this.slickGrid.resetActiveCell();
        }

        navigateUp() {
            this.slickGrid.navigateUp();
        }

        navigateDown() {
            this.slickGrid.navigateDown();
        }

        getActiveCell():Slick.Cell {
            return this.slickGrid.getActiveCell();
        }

        setActiveCell(row:number, cell:number) {
            this.slickGrid.setActiveCell(row, cell);
        }

        subscribeOnSelectedRowsChanged(callback:(e, args) => void) {
            this.slickGrid.onSelectedRowsChanged.subscribe(callback);
        }

        subscribeOnRowsChanged(callback:(e, args) => void) {
            this.dataView.subscribeOnRowsChanged(callback);
        }

        subscribeOnClick(callback:(e, args) => void) {
            this.slickGrid.onClick.subscribe(callback);
        }
    }
}