package com.enonic.wem.api.module;

import org.junit.Test;

import com.enonic.wem.api.form.Form;
import com.enonic.wem.api.form.Input;
import com.enonic.wem.api.form.inputtype.InputTypes;
import com.enonic.wem.api.schema.content.ContentTypeName;
import com.enonic.wem.api.schema.content.ContentTypeNames;

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertTrue;

public class ModuleTest
{
    @Test
    public void testCreateModule()
    {
        final Form config = Form.newForm().
            addFormItem( Input.newInput().name( "some-name" ).inputType( InputTypes.TEXT_LINE ).build() ).
            build();

        final ContentTypeNames requiredCtypes = ContentTypeNames.from( "ctype1", "ctype2", "ctype3" );
        final ModuleKeys requiredModules = ModuleKeys.from( ModuleKey.from( "modA-1.0.0" ), ModuleKey.from( "modB-1.0.0" ) );

        final Module module = Module.newModule().
            moduleKey( ModuleKey.from( "mymodule-1.0.0" ) ).
            displayName( "module display name" ).
            info( "module-info" ).
            url( "http://enonic.net" ).
            vendorName( "Enonic" ).
            vendorUrl( "https://www.enonic.com" ).
            minSystemVersion( ModuleVersion.from( 5, 0, 0 ) ).
            maxSystemVersion( ModuleVersion.from( 6, 0, 0 ) ).
            addModuleDependency( ModuleKey.from( "modulefoo-1.0.0" ) ).
            addContentTypeDependency( ContentTypeName.from( "article" ) ).
            addModuleDependencies( requiredModules ).
            addContentTypeDependencies( requiredCtypes ).
            config( config ).
            build();

        assertEquals( "mymodule-1.0.0", module.getModuleKey().toString() );
        assertEquals( "module display name", module.getDisplayName() );
        assertEquals( "module-info", module.getInfo() );
        assertEquals( "http://enonic.net", module.getUrl() );
        assertEquals( "Enonic", module.getVendorName() );
        assertEquals( "https://www.enonic.com", module.getVendorUrl() );
        assertEquals( "5.0.0", module.getMinSystemVersion().toString() );
        assertEquals( "6.0.0", module.getMaxSystemVersion().toString() );
        assertEquals( InputTypes.TEXT_LINE, module.getConfig().getInput( "some-name" ).getInputType() );
        assertTrue( module.getContentTypeDependencies().contains( ContentTypeName.from( "article" ) ) );
        assertTrue( module.getModuleDependencies().contains( ModuleKey.from( "modulefoo-1.0.0" ) ) );
        assertEquals( 4, module.getContentTypeDependencies().getSize() );
        assertEquals( 3, module.getModuleDependencies().getSize() );
    }

    @Test
    public void testModuleCopy()
    {
        final Form config = Form.newForm().
            addFormItem( Input.newInput().name( "some-name" ).inputType( InputTypes.TEXT_LINE ).build() ).
            build();

        final ContentTypeNames requiredCtypes = ContentTypeNames.from( "ctype1", "ctype2", "ctype3" );
        final ModuleKeys requiredModules = ModuleKeys.from( ModuleKey.from( "modA-1.0.0" ), ModuleKey.from( "modB-1.0.0" ) );

        final Module sourceModule = Module.newModule().
            moduleKey( ModuleKey.from( "mymodule-1.0.0" ) ).
            displayName( "module display name" ).
            info( "module-info" ).
            url( "http://enonic.net" ).
            vendorName( "Enonic" ).
            vendorUrl( "https://www.enonic.com" ).
            minSystemVersion( ModuleVersion.from( 5, 0, 0 ) ).
            maxSystemVersion( ModuleVersion.from( 6, 0, 0 ) ).
            addModuleDependency( ModuleKey.from( "modulefoo-1.0.0" ) ).
            addContentTypeDependency( ContentTypeName.from( "article" ) ).
            addModuleDependencies( requiredModules ).
            addContentTypeDependencies( requiredCtypes ).
            config( config ).
            build();

        final Module copiedModule = Module.newModule( sourceModule ).build();

        assertEquals( copiedModule.getModuleKey(), sourceModule.getModuleKey() );
        assertEquals( copiedModule.getDisplayName(), sourceModule.getDisplayName() );
        assertEquals( copiedModule.getInfo(), sourceModule.getInfo() );
        assertEquals( copiedModule.getUrl(), sourceModule.getUrl() );
        assertEquals( copiedModule.getVendorName(), sourceModule.getVendorName() );
        assertEquals( copiedModule.getVendorUrl(), sourceModule.getVendorUrl() );
        assertEquals( copiedModule.getMinSystemVersion(), sourceModule.getMinSystemVersion() );
        assertEquals( copiedModule.getMaxSystemVersion(), sourceModule.getMaxSystemVersion() );
        assertEquals( copiedModule.getConfig().toString(), sourceModule.getConfig().toString() );
        assertEquals( copiedModule.getContentTypeDependencies(), sourceModule.getContentTypeDependencies() );
        assertEquals( copiedModule.getModuleDependencies(), sourceModule.getModuleDependencies() );
    }
}
