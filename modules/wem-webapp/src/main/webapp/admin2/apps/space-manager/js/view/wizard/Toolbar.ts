Ext.define('Admin.view.wizard.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.spaceAdminWizardToolbar',

    cls: 'admin-toolbar',

    border: false,

    isNewGroup: true,

    defaults: {
        scale: 'medium'
    },

    initComponent: function () {
        this.items = <any[]>[
            {
                text: 'Save',
                action: 'saveSpace',
                itemId: 'save',
                disabled: true
            },
            {
                text: 'Delete',
                disabled: this.isNew,
                action: 'deleteSpace'
            },
            {
                text: 'Duplicate',
                disabled: this.isNew
            },
            '->',
            {
                text: 'Close',
                action: 'closeWizard'
            }
        ];
        this.callParent(arguments);
    }

});
