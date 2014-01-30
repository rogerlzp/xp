package com.enonic.wem.api.content.page;


import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableMap;

import com.enonic.wem.api.content.page.layout.LayoutComponent;
import com.enonic.wem.api.content.page.region.Region;

public abstract class AbstractRegions
    implements Iterable<Region>
{
    private final ImmutableMap<String, Region> regionByName;

    protected AbstractRegions( final Builder builder )
    {
        this.regionByName = builder.regionMapBuilder.build();
    }

    public Region getRegion( final String name )
    {
        return this.regionByName.get( name );
    }

    public PageComponent getComponent( final ComponentPath path )
    {
        Preconditions.checkNotNull( path, "no path for PageComponent given" );
        Preconditions.checkArgument( path.numberOfLevels() > 0, "empty path for PageComponent given" );

        final ComponentPath.RegionAndComponent first = path.getFirstLevel();
        final Region region = getRegion( first.getRegionName() );
        final PageComponent component = region.getComponent( first.getComponentName() );

        if ( path.numberOfLevels() == 1 )
        {
            return component;
        }
        else
        {
            if ( !( component instanceof LayoutComponent ) )
            {
                throw new IllegalArgumentException( "Expected component to be a LayoutComponent: " + component.getClass().getSimpleName() );
            }

            final LayoutComponent layoutComponent = (LayoutComponent) component;
            return layoutComponent.getComponent( path.removeFirstLevel() );
        }
    }

    @Override
    public Iterator<Region> iterator()
    {
        return this.regionByName.values().iterator();
    }

    public static class Builder<BUILDER extends Builder>
    {
        private final List<Region> regions = new ArrayList<>();

        private ImmutableMap.Builder<String, Region> regionMapBuilder = new ImmutableMap.Builder<>();

        @SuppressWarnings("unchecked")
        private BUILDER getThis()
        {
            return (BUILDER) this;
        }

        public BUILDER add( final Region region )
        {
            regions.add( region );
            regionMapBuilder.put( region.getName(), region );
            return getThis();
        }

        public Iterable<Region> regions()
        {
            return regions;
        }
    }
}


