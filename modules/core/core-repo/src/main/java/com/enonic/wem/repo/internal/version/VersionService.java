package com.enonic.wem.repo.internal.version;

import com.enonic.wem.repo.internal.InternalContext;
import com.enonic.xp.node.NodeVersion;
import com.enonic.xp.node.NodeVersionDiffQuery;
import com.enonic.xp.node.NodeVersionDiffResult;
import com.enonic.xp.node.NodeVersionQueryResult;

public interface VersionService
{
    void store( final NodeVersionDocument nodeVersionDocument, final InternalContext context );

    NodeVersion getVersion( final NodeVersionDocumentId versionId, final InternalContext context );

    NodeVersionQueryResult findVersions( final NodeVersionQuery query, final InternalContext context );

    NodeVersionDiffResult diff( final NodeVersionDiffQuery query, final InternalContext context );
}