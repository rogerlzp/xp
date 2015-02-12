package com.enonic.wem.admin.app;

import java.net.URI;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.wem.admin.AdminResource;

@Path("/")
@Component(immediate = true)
public final class MainResource
    implements AdminResource
{
    private final AppHtmlHandler appHtmlHandler;

    private final ResourceHandler resourceHandler;

    public MainResource()
    {
        this.appHtmlHandler = new AppHtmlHandler();
        this.resourceHandler = new ResourceHandler();
    }

    @GET
    public Response redirectToLoginPage()
        throws Exception
    {
        return Response.temporaryRedirect( new URI( "/admin" )).build();
    }

    @GET
    @Path("{path:.+}")
    public Response getResource( @PathParam("path") final String path )
        throws Exception
    {
        return this.resourceHandler.handle( path );
    }

    @GET
    @Path("admin")
    @Produces("text/html")
    public String getAdminApp( @QueryParam("app") @DefaultValue("app-launcher") final String app )
    {
        return this.appHtmlHandler.render( app );
    }

    @Reference
    public void setResourceLocator( final ResourceLocator resourceLocator )
    {
        this.resourceHandler.setResourceLocator( resourceLocator );
    }
}
