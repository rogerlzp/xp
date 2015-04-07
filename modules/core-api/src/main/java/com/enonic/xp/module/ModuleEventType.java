package com.enonic.xp.module;

import java.util.HashMap;
import java.util.Map;

import org.osgi.framework.BundleEvent;

import com.google.common.annotations.Beta;

@Beta
public enum ModuleEventType
{
    INSTALLED( BundleEvent.INSTALLED ),
    RESOLVED( BundleEvent.RESOLVED ),
    LAZY_ACTIVATION( BundleEvent.LAZY_ACTIVATION ),
    STARTING( BundleEvent.STARTING ),
    STARTED( BundleEvent.STARTED ),
    STOPPING( BundleEvent.STOPPING ),
    STOPPED( BundleEvent.STOPPED ),
    UPDATED( BundleEvent.UPDATED ),
    UNRESOLVED( BundleEvent.UNRESOLVED ),
    UNINSTALLED( BundleEvent.UNINSTALLED );

    private static final Map<Integer, ModuleEventType> LOOKUP_TABLE = new HashMap<>();

    static
    {
        for ( final ModuleEventType moduleEventType : ModuleEventType.values() )
        {
            LOOKUP_TABLE.put( moduleEventType.bundleEventId, moduleEventType );
        }
    }

    private final int bundleEventId;

    private ModuleEventType( final int bundleEventId )
    {
        this.bundleEventId = bundleEventId;
    }

    public static ModuleEventType fromBundleEvent( final BundleEvent bundle )
    {
        return LOOKUP_TABLE.get( bundle.getType() );
    }
}
