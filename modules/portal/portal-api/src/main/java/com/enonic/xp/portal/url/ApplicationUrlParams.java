package com.enonic.xp.portal.url;

import com.google.common.annotations.Beta;
import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;
import com.google.common.collect.Multimap;

@Beta
public final class ApplicationUrlParams
    extends AbstractUrlParams<ApplicationUrlParams>
{
    private String application;

    private String path;

    public String getPath()
    {
        return this.path;
    }

    public String getApplication()
    {
        return this.application;
    }

    public ApplicationUrlParams path( final String value )
    {
        this.path = Strings.emptyToNull( value );
        return this;
    }

    public ApplicationUrlParams application( final String value )
    {
        this.application = Strings.emptyToNull( value );
        return this;
    }

    @Override
    public ApplicationUrlParams setAsMap( final Multimap<String, String> map )
    {
        super.setAsMap( map );
        path( singleValue( map, "_path" ) );
        application( singleValue( map, "_application" ) );
        getParams().putAll( map );
        return this;
    }

    @Override
    protected void buildToString( final MoreObjects.ToStringHelper helper )
    {
        super.buildToString( helper );
        helper.add( "path", this.path );
        helper.add( "application", this.application );
    }
}
