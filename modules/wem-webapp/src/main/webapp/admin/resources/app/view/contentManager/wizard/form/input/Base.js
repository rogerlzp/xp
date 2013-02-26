Ext.define('Admin.view.contentManager.wizard.form.input.Base', {
    extend: 'Ext.form.FieldContainer',
    label: '',

    inputConfig: undefined,

    minWidth: 640,
    labelWidth: 105,

    layout: {
        type: 'hbox'
    },

    mixins: {
        formItemOccurrencesHandler: 'Admin.view.contentManager.wizard.form.FormItemOccurrencesHandler'
    },

    listeners: {
        beforerender: function () {
            this.handleOccurrences(this.inputConfig.occurrences.minimum);
        }
    },


    initComponent: function () {

        this.defaults = {
            width: 450
        };
        if (this.copyNo > this.inputConfig.occurrences.minimum && this.copyNo > 1) {
            this.items.push(this.createDeleteButton());
        }
        this.callParent(arguments);

    },

    bindOccurrencesEventsHandlers: function () {
        this.on('copyadded', this.updateButtonState, this);
        this.on('copyremoved', this.updateButtonState, this);
    },

    getValue: function () {
        return {
            path: this.name.concat('[', this.copyNo - 1, ']'),
            value: this.items.items[0].getValue()
        };
    },

    setValue: function (value) {

    },

    /**
     * @private
     * @return {*}
     */
    createDeleteButton: function () {
        var element = this;
        return {
            xtype: 'button',
            mode: 'delete',
            itemId: 'delete-button',
            iconCls: 'icon-remove icon-2x',
            cls: 'nobg icon-button',
            scale: 'medium',
            width: '24',
            listeners: {
                click: function () {
                    var remainElement = element.removeCopy();
                    if (remainElement) {
                        remainElement.updateButtonState();
                    }
                }
            }
        };
    },

    /**
     * @private
     * @param disabled
     */
    setButtonDisabled: function (disabled) {
        var button = this.down('#add-delete-button');
        if (button) {
            button.setDisabled(disabled);
        }
    },

    /**
     * Update state of component buttons, they could be either delete buttons or add buttons
     */
    updateButtonState: function () {
        var totalCount = 1;
        var tmp = this;
        while (tmp.prevField) {
            tmp = tmp.prevField;
        }
        var root = tmp;
        while (tmp.nextField) {
            tmp = tmp.nextField;
            totalCount++;
        }
        root.updateButtonStateInternal(totalCount);
    },

    /**
     * @private
     * @param totalCount
     */
    updateButtonStateInternal: function (totalCount) {
        var min = this.inputConfig.occurrences.minimum;
        this.setButtonDisabled(totalCount === min && this.copyNo !== totalCount);
        if (this.nextField) {
            this.nextField.updateButtonStateInternal(totalCount);
        }
    }


});
