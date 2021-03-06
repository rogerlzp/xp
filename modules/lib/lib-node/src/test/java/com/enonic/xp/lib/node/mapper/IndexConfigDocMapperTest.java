package com.enonic.xp.lib.node.mapper;

import org.junit.Test;

import com.enonic.xp.index.IndexConfig;
import com.enonic.xp.index.IndexConfigDocument;
import com.enonic.xp.index.PatternIndexConfigDocument;
import com.enonic.xp.script.serializer.JsonMapGenerator;

public class IndexConfigDocMapperTest
    extends BaseMapperTest
{
    @Test
    public void all()
        throws Exception
    {
        final IndexConfigDocument doc = PatternIndexConfigDocument.create().
            defaultConfig( IndexConfig.BY_TYPE ).
            add( "path", IndexConfig.PATH ).
            add( "none", IndexConfig.NONE ).
            add( "minimal", IndexConfig.MINIMAL ).
            add( "full", IndexConfig.FULLTEXT ).
            add( "byType", IndexConfig.BY_TYPE ).
            build();

        final JsonMapGenerator jsonGenerator = new JsonMapGenerator();
        new IndexConfigDocMapper( doc ).serialize( jsonGenerator );

        assertJson( "index_config_full.json", jsonGenerator );
    }
}