package com.enonic.wem.core.resource.dao;

import java.io.File;

import javax.inject.Inject;

import com.google.common.io.Files;

import com.enonic.wem.api.resource.Resource;
import com.enonic.wem.core.config.SystemConfig;

import static com.enonic.wem.api.resource.Resource.newResource;

public class ResourceDaoImpl
    implements ResourceDao
{
    private File resourceRoot;


    @Override
    public Resource getResource( String path, String module )
    {

        File resourceFile = new File( this.resourceRoot, path );

        if ( !resourceFile.exists() )
        {
            return null;
        }

        final Resource resource = newResource().
            name( resourceFile.getName() ).
            byteSource( Files.asByteSource( resourceFile ) ).
            size( resourceFile.length() ).
            build();

        return resource;
    }

    @Inject
    public void setSystemConfig( final SystemConfig systemConfig )
    {
        this.resourceRoot = new File( systemConfig.getDataDir(), "resources" );
    }

}
