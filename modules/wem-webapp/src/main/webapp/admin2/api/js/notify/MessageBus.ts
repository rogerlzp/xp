module admin.api.message {

    var messageBus = Ext.create('Ext.util.Observable');

    export function showFeedback(message:String):void {
        messageBus.fireEvent('showNotification', 'notify', message);
    }

    export function updateAppTabCount(appId, tabCount:Number):void {
        var eventName = 'topBar.onUpdateAppTabCount';
        var config = {
            appId: appId,
            tabCount: tabCount
        };
        // Make sure the MessageBus in the home frame gets the event.
        /*if (window.parent) {
         window.parent['admin']['api']['message'].messageBus.fireEvent(eventName, config);
         }*/
        messageBus.fireEvent(eventName, config);
    }

    export function addListener(name:String, func:Function, scope:any):void {
        messageBus.addListener(name, func, scope);
    }

}