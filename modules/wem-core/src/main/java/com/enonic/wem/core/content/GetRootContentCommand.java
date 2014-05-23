package com.enonic.wem.core.content;

import com.enonic.wem.api.content.ContentConstants;
import com.enonic.wem.api.content.Contents;
import com.enonic.wem.api.entity.NodePath;
import com.enonic.wem.api.entity.Nodes;

final class GetRootContentCommand
    extends AbstractContentCommand
{
    GetRootContentCommand( final AbstractContentCommand.Builder builder )
    {
        super( builder );
    }

    public static Builder create()
    {
        return new Builder();
    }

    Contents execute()
    {
        final NodePath nodePath = ContentNodeHelper.CONTENT_ROOT_NODE.asAbsolute();
        final Nodes rootNodes = nodeService.getByParent( nodePath, ContentConstants.DEFAULT_CONTEXT );
        final Contents contents = getTranslator().fromNodes( removeNonContentNodes( rootNodes ) );

        return ChildContentIdsResolver.create().
            nodeService( this.nodeService ).
            contentTypeService( this.contentTypeService ).
            blobService( this.blobService ).
            context( this.context ).
            build().
            resolve( contents );
    }

    public static class Builder
        extends AbstractContentCommand.Builder<Builder>
    {
        public GetRootContentCommand build()
        {
            return new GetRootContentCommand( this );
        }
    }

}
