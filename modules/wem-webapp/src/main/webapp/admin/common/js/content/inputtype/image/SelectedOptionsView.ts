module api.content.inputtype.image {

    import SelectedOption = api.ui.selector.combobox.SelectedOption;
    import ContentSummary = api.content.ContentSummary;

    export class SelectedOptionsView extends api.ui.selector.combobox.SelectedOptionsView<ContentSummary> {

        private numberOfOptionsPerRow: number = 3;

        private activeOption: SelectedOption<ContentSummary>;

        private selection: SelectedOption<ContentSummary>[] = [];

        private toolbar: SelectionToolbar;

        private dialog: ImageSelectorDialog;

        private editSelectedOptionsListeners: {(option: SelectedOption<ContentSummary>[]): void}[] = [];

        private removeSelectedOptionsListeners: {(option: SelectedOption<ContentSummary>[]): void}[] = [];

        private mouseClickListener: {(MouseEvent): void};

        constructor() {
            super();

            this.dialog = new ImageSelectorDialog();
            this.dialog.hide();
            this.appendChild(this.dialog);

            this.toolbar = new SelectionToolbar();
            this.toolbar.hide();
            this.toolbar.addEditClickListener(() => {
                this.notifyEditSelectedOptions(this.selection);
            });
            this.toolbar.addRemoveClickListener(() => {
                this.notifyRemoveSelectedOptions(this.selection);
                // clear the selection;
                this.selection.length = 0;
                this.updateSelectionToolbarLayout();

            });
            this.appendChild(this.toolbar);

            this.onShown((event: api.dom.ElementShownEvent) => {
                this.updateLayout();
            });
        }

        private notifyRemoveSelectedOptions(option: SelectedOption<ContentSummary>[]) {
            this.removeSelectedOptionsListeners.forEach((listener) => {
                listener(option);
            });
        }

        addRemoveSelectedOptionsListener(listener: (option: SelectedOption<ContentSummary>[]) => void) {
            this.removeSelectedOptionsListeners.push(listener);
        }

        removeRemoveSelectedOptionsListener(listener: (option: SelectedOption<ContentSummary>[]) => void) {
            this.removeSelectedOptionsListeners = this.removeSelectedOptionsListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        private notifyEditSelectedOptions(option: SelectedOption<ContentSummary>[]) {
            this.editSelectedOptionsListeners.forEach((listener) => {
                listener(option);
            });
        }

        addEditSelectedOptionsListener(listener: (option: SelectedOption<ContentSummary>[]) => void) {
            this.editSelectedOptionsListeners.push(listener);
        }

        removeEditSelectedOptionsListener(listener: (option: SelectedOption<ContentSummary>[]) => void) {
            this.editSelectedOptionsListeners = this.editSelectedOptionsListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        createSelectedOption(option: api.ui.selector.Option<ContentSummary>, index: number): SelectedOption<ContentSummary> {

            return new SelectedOption<ContentSummary>(new SelectedOptionView(option), option, index);
        }

        addOptionView(option: SelectedOption<ContentSummary>) {

            this.dialog.hide();
            var optionView: SelectedOptionView = <SelectedOptionView>option.getOptionView();

            optionView.onClicked((event: MouseEvent) => {
                if (this.dialog.isVisible()) {
                    this.hideImageSelectorDialog();
                    this.activateKeyListeners(false);
                } else {
                    this.showImageSelectorDialog(option);
                    this.activateKeyListeners(true);
                }
            });
            optionView.addCheckListener((view: SelectedOptionView, checked: boolean) => {
                if (checked) {
                    this.selection.push(option);
                } else {
                    var index = this.selection.indexOf(option);
                    if (index > -1) {
                        this.selection.splice(index, 1);
                    }
                }

                this.updateSelectionToolbarLayout();
            });

            optionView.getIcon().onLoaded((event: UIEvent) => {
                this.updateOptionViewLayout(optionView, this.calculateOptionHeight());
            });

            optionView.insertBeforeEl(this.toolbar);
        }

        private activateKeyListeners(activate: boolean) {
            var binding = new api.ui.KeyBinding("space", (event: ExtendedKeyboardEvent, combo: string) => {
                (<SelectedOptionView>this.activeOption.getOptionView()).toggleChecked();
                event.preventDefault();
            });
            if (activate) {
                api.ui.KeyBindings.get().bindKey(binding);
            } else {
                api.ui.KeyBindings.get().unbindKey(binding);
            }
        }

        private showImageSelectorDialog(option: SelectedOption<ContentSummary>) {

            var selectedOptionViews = this.getSelectedOptionViews();
            for (var i = 0; i < selectedOptionViews.length; i++) {
                var view = <SelectedOptionView>selectedOptionViews[i];
                var passedSelectedOption = i >= option.getIndex();
                if ((this.isLastInRow(i) || this.isLast(i)) && passedSelectedOption) {
                    this.dialog.insertAfterEl(view);
                    break;
                }
            }

            if (this.activeOption) {
                this.activeOption.getOptionView().removeClass('editing first-in-row last-in-row');
            }
            this.activeOption = option;
            option.getOptionView().addClass('editing' + (this.isFirstInRow(option.getIndex()) ? ' first-in-row' : '') +
                                            (this.isLastInRow(option.getIndex()) ? ' last-in-row' : ''));

            this.dialog.setContent(option.getOption().displayValue);
            if (!this.dialog.isVisible()) {
                this.setOutsideClickListener();
                this.dialog.show();
                this.updateDialogLayout(this.calculateOptionHeight());
            }
        }

        updateLayout() {
            var optionHeight = this.calculateOptionHeight();
            this.getSelectedOptionViews().forEach((optionView: SelectedOptionView) => {
                this.updateOptionViewLayout(optionView, optionHeight);
            });
            if (this.dialog.isVisible()) {
                this.updateDialogLayout(optionHeight);
            }
        }

        private updateOptionViewLayout(optionView: SelectedOptionView, optionHeight: number) {
            optionView.getEl().setHeightPx(optionHeight);
            var iconHeight = optionView.getIcon().getEl().getHeightWithBorder();
            if (iconHeight < optionHeight && iconHeight !== 0) {
                optionView.getIcon().getEl().setMarginTop((optionHeight - iconHeight) / 2 + 'px');
            }
        }

        private updateDialogLayout(optionHeight) {
            this.dialog.getEl().setMarginTop(((optionHeight / 3) - 20) + 'px');
        }

        private updateSelectionToolbarLayout() {
            var showToolbar = this.selection.length > 0;
            this.toolbar.setVisible(showToolbar);
            if (showToolbar) {
                this.toolbar.setSelectionCount(this.selection.length);
            }
        }

        private calculateOptionHeight(): number {
            var availableWidth = this.getEl().getWidthWithMargin();
            return Math.floor(0.3 * availableWidth);
        }

        private hideImageSelectorDialog() {
            this.dialog.hide();
            this.activeOption.getOptionView().removeClass('editing first-in-row last-in-row');
            api.dom.Body.get().unClicked(this.mouseClickListener);
        }

        private setOutsideClickListener() {
            var selectedOptionsView = this;
            this.mouseClickListener = (event: MouseEvent) => {
                var viewHtmlElement = selectedOptionsView.getHTMLElement();
                for (var element = event.target; element; element = (<any>element).parentNode) {
                    if (element == viewHtmlElement) {
                        return;
                    }
                }

                selectedOptionsView.hideImageSelectorDialog();
            };

            api.dom.Body.get().onClicked(this.mouseClickListener);
        }

        private isLastInRow(index: number): boolean {
            return index % this.numberOfOptionsPerRow == 2;
        }

        private isFirstInRow(index: number): boolean {
            return index % this.numberOfOptionsPerRow == 0;
        }

        private isLast(index: number): boolean {
            return index == this.getSelectedOptionViews().length - 1;
        }

    }

}
