package com.enonic.wem.thymeleaf.internal;

import org.junit.Before;
import org.junit.Test;

import com.enonic.wem.script.AbstractScriptTest;

public class ThymeleafScriptTest
    extends AbstractScriptTest
{
    @Before
    public void setUp()
    {
        final ThymeleafScriptContributor contributor = new ThymeleafScriptContributor();
        contributor.setProcessor( new ThymeleafProcessorImpl() );

        addContributor( contributor );
    }

    @Test
    public void renderTest()
    {
        runTestScript( "thymeleaf-test.js" );
    }
}
