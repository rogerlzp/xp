package com.enonic.wem.core.content.page.part;

import org.junit.Assert;
import org.junit.Test;

import com.enonic.wem.api.content.page.DescriptorKey;
import com.enonic.wem.api.content.page.region.PartDescriptor;

public class PartDescriptorServiceImpl_getByKeyTest
    extends AbstractPartDescriptorServiceTest
{
    @Test
    public void getPageDescriptor()
        throws Exception
    {
        final DescriptorKey key = createDescriptor( "foomodule:part-descr" );
        final PartDescriptor descriptor = this.service.getByKey( key );
        Assert.assertNotNull( descriptor );
    }
}
