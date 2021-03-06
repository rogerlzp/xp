package com.enonic.xp.admin.impl.rest.resource.content.query;

import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import com.enonic.xp.content.Content;
import com.enonic.xp.content.ContentId;
import com.enonic.xp.content.ContentIds;
import com.enonic.xp.content.ContentPaths;
import com.enonic.xp.content.ContentQuery;
import com.enonic.xp.content.ContentService;
import com.enonic.xp.content.Contents;
import com.enonic.xp.content.GetContentByIdsParams;
import com.enonic.xp.index.ChildOrder;

public class ContentQueryWithChildrenTest
{
    private ContentService contentService;

    @Before
    public final void setUp()
        throws Exception
    {
        this.contentService = Mockito.mock( ContentService.class );
    }

    @Test
    public void initialize_default()
        throws Exception
    {
        final ArgumentCaptor<ContentQuery> contentQueryArgumentCaptor = ArgumentCaptor.forClass( ContentQuery.class );
        final ContentQueryWithChildren contentQueryWithChildren =
            ContentQueryWithChildren.create().contentService( contentService ).build();

        contentQueryWithChildren.find();
        contentQueryWithChildren.findOrdered();

        Mockito.verify( contentService, Mockito.times( 2 ) ).find( contentQueryArgumentCaptor.capture() );

        final List<ContentQuery> contentQueries = contentQueryArgumentCaptor.getAllValues();
        final ContentQuery query = contentQueries.get( 0 );
        final ContentQuery orderedQuery = contentQueries.get( 1 );

        Assert.assertEquals( query.getSize(), 0 );
        Assert.assertEquals( query.getFrom(), 0 );
        Assert.assertEquals( query.getQueryExpr().toString(), "(_path LIKE '/contentnull/*' AND _path NOT IN ()) ORDER BY _path ASC" );

        Assert.assertEquals( orderedQuery.getSize(), 0 );
        Assert.assertEquals( orderedQuery.getFrom(), 0 );
        Assert.assertEquals( orderedQuery.getQueryExpr().toString(), "_path IN ()" );
    }

    @Test
    public void initialize_custom()
        throws Exception
    {
        final ArgumentCaptor<ContentQuery> contentQueryArgumentCaptor = ArgumentCaptor.forClass( ContentQuery.class );
        final ContentQueryWithChildren contentQueryWithChildren = ContentQueryWithChildren.create().
            contentService( contentService ).
            from( 1 ).
            size( -1 ).
            order( ChildOrder.manualOrder() ).
            contentsPaths( ContentPaths.from( "my-path" ) ).
            build();

        contentQueryWithChildren.find();
        contentQueryWithChildren.findOrdered();

        Mockito.verify( contentService, Mockito.times( 2 ) ).find( contentQueryArgumentCaptor.capture() );

        final List<ContentQuery> contentQueries = contentQueryArgumentCaptor.getAllValues();
        final ContentQuery query = contentQueries.get( 0 );
        final ContentQuery orderedQuery = contentQueries.get( 1 );

        Assert.assertEquals( query.getSize(), -1 );
        Assert.assertEquals( query.getFrom(), 1 );
        Assert.assertEquals( query.getQueryExpr().toString(),
                             "(_path LIKE '/contentmy-path/*' AND _path NOT IN ('/contentmy-path')) ORDER BY _path ASC" );

        Assert.assertEquals( orderedQuery.getSize(), -1 );
        Assert.assertEquals( orderedQuery.getFrom(), 1 );
        Assert.assertEquals( orderedQuery.getQueryExpr().toString(),
                             "_path IN ('/content/my-path') ORDER BY _manualordervalue DESC, _timestamp DESC" );
    }

    @Test
    public void initialize_with_ids()
        throws Exception
    {
        final ArgumentCaptor<ContentQuery> contentQueryArgumentCaptor = ArgumentCaptor.forClass( ContentQuery.class );
        final ContentQueryWithChildren contentQueryWithChildren = ContentQueryWithChildren.create().
            contentService( contentService ).
            order( ChildOrder.manualOrder() ).
            contentsIds( ContentIds.from( "myid" ) ).
            build();

        final Content content = Content.create().
            id( ContentId.from( "myid" ) ).
            path( "my-path" ).
            build();
        Mockito.when( contentService.getByIds( Mockito.isA( GetContentByIdsParams.class ) ) ).thenReturn( Contents.from( content ) );

        contentQueryWithChildren.find();
        contentQueryWithChildren.findOrdered();

        Mockito.verify( contentService, Mockito.times( 2 ) ).find( contentQueryArgumentCaptor.capture() );

        final List<ContentQuery> contentQueries = contentQueryArgumentCaptor.getAllValues();
        final ContentQuery query = contentQueries.get( 0 );
        final ContentQuery orderedQuery = contentQueries.get( 1 );

        Assert.assertEquals( query.getQueryExpr().toString(),
                             "(_path LIKE '/content/my-path/*' AND _path NOT IN ('/content/my-path')) ORDER BY _path ASC" );
        Assert.assertEquals( orderedQuery.getQueryExpr().toString(),
                             "_path IN ('/content//my-path') ORDER BY _manualordervalue DESC, _timestamp DESC" );
    }
}
