module api.security {

    export interface UserStoreJson {

        displayName: string;
        key: string;
        authApplication: string;
        permissions?: api.security.acl.UserStoreAccessControlEntryJson[];
    }
}