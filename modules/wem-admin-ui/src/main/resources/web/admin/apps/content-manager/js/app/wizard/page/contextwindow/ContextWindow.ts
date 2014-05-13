module app.wizard.page.contextwindow {

    import RootDataSet = api.data.RootDataSet;
    import LiveFormPanel = app.wizard.page.LiveFormPanel;
    import ComponentPath = api.content.page.ComponentPath;
    import Content = api.content.Content;
    import PageTemplateKey = api.content.page.PageTemplateKey;
    import PageTemplate = api.content.page.PageTemplate;
    import PageDescriptor = api.content.page.PageDescriptor;
    import PageComponent = api.content.page.PageComponent;
    import Region = api.content.page.region.Region;
    import ImageComponent = api.content.page.image.ImageComponent;
    import ImageComponentBuilder = api.content.page.image.ImageComponentBuilder;
    import BaseInspectionPanel = app.wizard.page.contextwindow.inspect.BaseInspectionPanel;
    import InspectionPanel = app.wizard.page.contextwindow.inspect.InspectionPanel;
    import InsertablesPanel = app.wizard.page.contextwindow.insert.InsertablesPanel;

    export interface ContextWindowConfig {

        liveEditPage: app.wizard.page.LiveEditPage;

        liveFormPanel:LiveFormPanel;

        inspectionPanel:InspectionPanel;

        emulatorPanel:EmulatorPanel;

        insertablesPanel:InsertablesPanel;
    }

    export class ContextWindow extends api.ui.DockedWindow {

        private insertablesPanel: InsertablesPanel;

        private inspectionPanel: InspectionPanel;

        private emulatorPanel: EmulatorPanel;

        private liveEditPage: app.wizard.page.LiveEditPage;

        private liveFormPanel: LiveFormPanel;

        private pinButton: PinButton;

        private pinned: boolean;

        private dynamicPinning: boolean;

        private splitter: api.dom.DivEl;

        private ghostDragger: api.dom.DivEl;

        private mask: api.ui.DragMask;

        private actualWidth: number;

        private minWidth: number = 280;

        private parentMinWidth: number = 15;

        constructor(config: ContextWindowConfig) {
            super();

            this.pinned = true;
            this.dynamicPinning = true;
            this.liveEditPage = config.liveEditPage;
            this.liveFormPanel = config.liveFormPanel;
            this.inspectionPanel = config.inspectionPanel;
            this.emulatorPanel = config.emulatorPanel;
            this.insertablesPanel = config.insertablesPanel;

            this.addClass("context-window");

            this.ghostDragger = new api.dom.DivEl("ghost-dragger");
            this.splitter = new api.dom.DivEl("splitter");

            this.insertablesPanel.onHideContextWindowRequest(() => {
                this.hide();
            });

            app.wizard.ToggleContextWindowEvent.on(() => {
                if (!this.isEnabled()) {
                    this.enable();
                } else {
                    this.disable();
                }
                this.updateFrameSize();
            });

            $(window).resize(() => {
                this.updateFrameSize();
            });

            this.appendChild(this.splitter);
            this.addItem("Insert", this.insertablesPanel);
            this.addItem("Settings", this.inspectionPanel);
            this.addItem("Emulator", this.emulatorPanel);

            this.pinButton = new PinButton(this);
            this.appendChild(this.pinButton);

            this.onShown(() => {
                if (this.pinned) {
                    this.updateFrameSize();
                }
            });
            this.onRendered(() => {
                this.initializeResizable();
            })

        }

        private initializeResizable() {
            var initialPos = 0;
            var splitterPosition = 0;
            var parent = this.getParentElement();
            this.actualWidth = this.getEl().getWidth();
            this.mask = new api.ui.DragMask(parent);

            var dragListener = (e: MouseEvent) => {
                if (this.splitterWithinBoundaries(initialPos - e.clientX)) {
                    splitterPosition = e.clientX;
                    this.ghostDragger.getEl().setLeftPx(e.clientX - this.getEl().getOffsetLeft());
                }
            };

            this.splitter.onMouseDown((e: MouseEvent) => {
                e.preventDefault();
                initialPos = e.clientX;
                this.startDrag(dragListener);
            });

            this.mask.onMouseUp((e: MouseEvent) => {
                this.actualWidth = this.getEl().getWidth() + initialPos - splitterPosition;
                this.stopDrag(dragListener);
                this.throwResizeEvent();
            })
        }

        private splitterWithinBoundaries(offset: number) {
            var newWidth = this.actualWidth + offset;
            return (newWidth >= this.minWidth) && (newWidth <= this.getParentElement().getEl().getWidth() - this.parentMinWidth);
        }

        private startDrag(dragListener: {(e: MouseEvent):void}) {
            this.mask.show();
            this.mask.onMouseMove(dragListener);
            this.ghostDragger.insertBeforeEl(this.splitter);
            this.ghostDragger.getEl().setLeftPx(this.splitter.getEl().getOffsetLeftRelativeToParent()).setTop(null);
        }

        private stopDrag(dragListener: {(e: MouseEvent):void}) {
            this.mask.unMouseMove(dragListener);
            this.mask.hide();
            this.getEl().setWidthPx(this.actualWidth);
            this.removeChild(this.ghostDragger);
        }

        private throwResizeEvent() {
            var event = document.createEvent('Event');
            event.initEvent('resize', true, true);
            this.getHTMLElement().dispatchEvent(event);
        }

        disable() {
            this.addClass("hidden");
            this.getEl().setRight("-290px");
        }

        enable() {
            this.removeClass("hidden");
            this.getEl().setRight("0px");
        }

        hide() {
            if (!this.pinned) {
                super.hide();
            }
        }

        show() {
            if (!this.pinned) {
                super.show();
            }
        }

        public showInspectionPanel(panel: BaseInspectionPanel) {
            this.inspectionPanel.showInspectionPanel(panel);
            this.selectPanel(this.inspectionPanel);
        }

        public clearSelection() {
            this.inspectionPanel.clearSelection();
            this.selectPanel(this.insertablesPanel);
        }

        setPinned(value: boolean) {
            this.pinned = value;
            this.updateFrameSize();
            !value ? this.addClass("unpinned") : this.removeClass("unpinned");
        }

        isPinned(): boolean {
            return this.pinned;
        }

        setDynamicPinning(value: boolean) {
            this.dynamicPinning = value;
        }

        private isEnabled() {
            return !this.hasClass("hidden");

        }

        private updateFrameSize() {
            this.liveFormPanel.updateFrameContainerSize((this.pinned && this.isEnabled()), this.actualWidth || this.getEl().getWidth());
            // TODO: Replace 1380 with ENUM, when the specification will be ready.
            if (this.dynamicPinning) {
                var pinningRequired: boolean = this.liveFormPanel.getEl().getWidth() > 1380;
                if (pinningRequired != this.isPinned()) {
                    this.setPinned(pinningRequired);
                    this.pinButton.setActive(pinningRequired);
                }
            }
        }
    }
}
