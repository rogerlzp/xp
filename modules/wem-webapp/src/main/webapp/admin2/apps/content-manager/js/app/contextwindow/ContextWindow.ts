module app_contextwindow {
    export interface ContextWindowOptions {
        liveEditEl?:api_dom.IFrameEl;
        liveEditId?:string;
    }

    export class ContextWindow extends api_ui.NavigableFloatingWindow {
        private componentTypesPanel:ComponentTypesPanel;
        private inspectorPanel:InspectorPanel;
        private emulatorPanel:api_ui.Panel;

        private draggingMask:api_ui.DraggingMask;
        private liveEditEl:api_dom.IFrameEl;
        private liveEditJQuery:JQueryStatic;
        private contextWindowOptions:ContextWindowOptions;
        private selectedComponent:Component;

        constructor(options:ContextWindowOptions) {
            var dragStart = (event, ui) => {
                this.draggingMask.show();
            };

            var dragStop = (event, ui) => {
                this.draggingMask.hide();
            };

            super({draggableOptions: { start: dragStart, stop: dragStop, handle: ".tab-menu" } });
            this.contextWindowOptions = options;
            this.addClass("context-window");

            this.componentTypesPanel = new ComponentTypesPanel(this);
            this.inspectorPanel = new InspectorPanel(this);
            this.emulatorPanel = new api_ui.Panel();

            this.addItem("Insert", this.componentTypesPanel);
            this.addItem("Inspect", this.inspectorPanel);
            this.addItem("Emulator", this.emulatorPanel);

            ComponentSelectEvent.on((event) => {
                this.selectPanel(this.inspectorPanel);
                this.selectedComponent = event.getComponent();
            });

            ComponentDeselectEvent.on((event) => {
                this.selectPanel(this.componentTypesPanel);
            });

            ComponentRemovedEvent.on((event) => {
                this.selectPanel(this.componentTypesPanel);
            });

            if (options.liveEditEl) {
                this.liveEditEl = options.liveEditEl;
            }
        }

        afterRender() {
            if (this.contextWindowOptions.liveEditId) {
                var el = <HTMLIFrameElement>document.querySelector("#" + this.contextWindowOptions.liveEditId);
                if (el.tagName.toLowerCase() == "iframe") {
                    this.liveEditEl = <api_dom.IFrameEl> api_dom.IFrameEl.fromHtmlElement(el);
                }
            }
            this.draggingMask = new api_ui.DraggingMask(this.liveEditEl);
            document.body.appendChild(this.draggingMask.getHTMLElement());
            this.liveEditListen();
        }

        getDraggingMask() {
            return this.draggingMask;
        }

        private liveEditListen() {
            this.getLiveEditJQuery()(this.getLiveEditWindow()).on('selectComponent.liveEdit',
                (event, component, mouseClickPagePosition) => {
                    new ComponentSelectEvent(<Component>component).fire();
                    this.selectedComponent = component;
                });

            this.getLiveEditJQuery()(this.getLiveEditWindow()).on('deselectComponent.liveEdit', (event) => {
                new ComponentDeselectEvent().fire();
                this.selectedComponent = null;
            });

            this.getLiveEditJQuery()(this.getLiveEditWindow()).on('componentRemoved.liveEdit', (event) => {
                new ComponentRemovedEvent().fire();
                this.selectedComponent = null;
            });


        }

        getSelectedComponent():any {
            return this.selectedComponent;
        }

        getLiveEditJQuery():JQueryStatic {
            if (!this.liveEditJQuery) {
                console.log(this.getLiveEditWindow());
                this.liveEditJQuery = <JQueryStatic>this.getLiveEditWindow().$liveEdit;
            }
            return this.liveEditJQuery;

        }

        getLiveEditEl():api_dom.IFrameEl {
            return this.liveEditEl;
        }

        getLiveEditWindow():any {
            //TODO: "contentwindow" is hacky because we need HTMLIFrameElement to fetch that property, but it is impossible to cast to ><
            return this.liveEditEl.getHTMLElement()["contentWindow"];
        }

    }
}