import '../../api.ts';
import {IssueFetcher} from './IssueFetcher';
import {IssueStatsJson} from './IssueStatsJson';
import {IssueList, IssueListItem} from './IssueList';
import {IssueType} from './IssueType';
import {IssueDetailsDialog} from './IssueDetailsDialog';
import {GetIssueRequest} from './GetIssueRequest';
import {Issue} from './Issue';

import ModalDialog = api.ui.dialog.ModalDialog;
import DockedPanel = api.ui.panel.DockedPanel;
import Panel = api.ui.panel.Panel;
import TabBarItem = api.ui.tab.TabBarItem;
import LoadMask = api.ui.mask.LoadMask;
import PEl = api.dom.PEl;
import SpanEl = api.dom.SpanEl;
import Element = api.dom.Element;

export class IssuesDialog extends ModalDialog {

    private dockedPanel: DockedPanel;

    private assignedToMeIssuesPanel: Panel;
    private createdByMeIssuesPanel: Panel;
    private openIssuesPanel: Panel;
    private closedIssuesPanel: Panel;

    private loadMask: LoadMask;

    constructor() {
        super('Publishing Issues');
        this.addClass('issue-list-dialog');
        api.dom.Body.get().appendChild(this);

        this.initIssueDetailsDialog();
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then((rendered: boolean) => {
            this.appendChildToContentPanel(this.dockedPanel = this.createDockedPanel());
            this.appendChildToContentPanel(this.createNewIssueButton());
            return rendered;
        });
    }

    private createDockedPanel(): DockedPanel {
        let dockedPanel = new DockedPanel();
        dockedPanel.addItem('Assigned to me', true, this.assignedToMeIssuesPanel = this.createIssuePanel(IssueType.ASSIGNED_TO_ME));
        dockedPanel.addItem('My issues', true, this.createdByMeIssuesPanel = this.createIssuePanel(IssueType.CREATED_BY_ME));
        dockedPanel.addItem('Open', true, this.openIssuesPanel = this.createIssuePanel(IssueType.OPEN));
        dockedPanel.addItem('Closed', true, this.closedIssuesPanel = this.createIssuePanel(IssueType.CLOSED));

        return dockedPanel;
    }

    private createIssuePanel(issueType: IssueType): Panel {
        const panel: Panel = new Panel(IssueType[issueType]);

        panel.onShown(() => {
            const panelHasChildren = panel.getChildren().length > 0;

            if (!panelHasChildren && panel.isVisible()) { // to not reload after tab is loaded and switching between tabs
                const issueList: IssueList = new IssueList(issueType);
                panel.appendChild(issueList);

                issueList.onIssueSelected((issueListItem) => {
                    this.showIssueDetailsDialog(issueListItem);
                });
            }
        });

        return panel;
    }

    show() {
        this.cleanPanels();
        super.show();
        this.reloadIssueData();
    }

    private initIssueDetailsDialog() {
        this.addClickIgnoredElement(IssueDetailsDialog.get());

        IssueDetailsDialog.get().onClosed(() => {
            this.removeClass('masked');
            if(this.isVisible()) {
                this.getEl().focus();
            }
        });
    }

    showIssueDetailsDialog(issueListItem: IssueListItem) {
        this.addClass('masked');

        new GetIssueRequest(issueListItem.getIssue().getId()).sendAndParse().then((issue: Issue) => {
            IssueDetailsDialog.get().setIssue(issue).toggleNested(true).open();
        });
    }

    protected hasSubDialog(): boolean {
        return true;
    }

    private reloadIssueData() {
        IssueFetcher.fetchIssueStats().then((stats: IssueStatsJson) => {
            this.updateTabLabels(stats);
            this.showFirstNonEmptyTab(stats);
        }).catch((reason: any) => {
            api.DefaultErrorHandler.handle(reason);
        });
    }

    private updateTabLabels(stats: IssueStatsJson) {
        this.updateTabLabel(this.dockedPanel.getNavigator().getNavigationItem(0), 'Assigned to me', stats.assignedToMe);
        this.updateTabLabel(this.dockedPanel.getNavigator().getNavigationItem(1), 'My issues', stats.createdByMe);
        this.updateTabLabel(this.dockedPanel.getNavigator().getNavigationItem(2), 'Open', stats.open);
        this.updateTabLabel(this.dockedPanel.getNavigator().getNavigationItem(3), 'Closed', stats.closed);
    }

    private updateTabLabel(tabBarItem: TabBarItem, label: string, issuesFound: number) {
        tabBarItem.setLabel(issuesFound > 0 ? (label + ' (' + issuesFound + ')') : label);
    }

    private showFirstNonEmptyTab(stats: IssueStatsJson) {
        if (stats.assignedToMe > 0) {
            this.dockedPanel.selectPanel(this.assignedToMeIssuesPanel);
        } else if (stats.createdByMe > 0) {
            this.dockedPanel.selectPanel(this.createdByMeIssuesPanel);
        } else if (stats.open > 0) {
            this.dockedPanel.selectPanel(this.openIssuesPanel);
        } else if (stats.closed > 0) {
            this.dockedPanel.selectPanel(this.closedIssuesPanel);
        } else {
            this.dockedPanel.selectPanel(this.assignedToMeIssuesPanel);
        }
    }

    private cleanPanels() {
        this.assignedToMeIssuesPanel.removeChildren();
        this.createdByMeIssuesPanel.removeChildren();
        this.openIssuesPanel.removeChildren();
        this.closedIssuesPanel.removeChildren();
    }

    private createNewIssueButton(): Element {
        const newIssueButton: SpanEl = new SpanEl().addClass('new-issue-button');
        newIssueButton.getEl().setTitle('Create an issue');
        return newIssueButton;
    }

}
