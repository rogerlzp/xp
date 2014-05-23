package com.enonic.wem.core.content;

import com.enonic.wem.api.content.Content;
import com.enonic.wem.api.content.ContentConstants;
import com.enonic.wem.api.content.RenameContentParams;
import com.enonic.wem.api.entity.EntityId;
import com.enonic.wem.api.entity.NodeName;
import com.enonic.wem.api.entity.RenameNodeParams;


final class RenameContentCommand
    extends AbstractContentCommand
{
    private final RenameContentParams params;

    Content execute()
    {
        params.validate();

        return doExecute();
    }

    private RenameContentCommand( final Builder builder )
    {
        super( builder );
        this.params = builder.params;
    }

    private Content doExecute()
    {
        final EntityId entityId = EntityId.from( params.getContentId() );
        final NodeName nodeName = NodeName.from( params.getNewName().toString() );
        nodeService.rename( new RenameNodeParams().entityId( entityId ).nodeName( nodeName ), ContentConstants.DEFAULT_CONTEXT );

        return getContent( params.getContentId() );
    }

    public static Builder create( final RenameContentParams params )
    {
        return new Builder( params );
    }

    public static class Builder
        extends AbstractContentCommand.Builder<Builder>
    {
        private RenameContentParams params;

        public Builder( final RenameContentParams params )
        {
            this.params = params;
        }

        public RenameContentCommand build()
        {
            return new RenameContentCommand( this );
        }

    }


}

