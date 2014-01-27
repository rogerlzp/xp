package com.enonic.wem.api.command.schema.mixin;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;

import com.enonic.wem.api.command.Command;
import com.enonic.wem.api.form.FormItem;
import com.enonic.wem.api.form.FormItems;
import com.enonic.wem.api.schema.SchemaIcon;
import com.enonic.wem.api.schema.mixin.Mixin;
import com.enonic.wem.api.schema.mixin.MixinName;

public final class CreateMixin
    extends Command<Mixin>
{
    private MixinName name;

    private FormItems formItems = new FormItems( null );

    private String displayName;

    private SchemaIcon schemaIcon;


    public CreateMixin name( final MixinName name )
    {
        this.name = name;
        return this;
    }

    public CreateMixin name( final String name )
    {
        this.name = MixinName.from( name );
        return this;
    }

    public CreateMixin formItems( final FormItems formItems )
    {
        this.formItems = formItems;
        return this;
    }

    public CreateMixin addFormItem( final FormItem formItem )
    {
        this.formItems.add( formItem );
        return this;
    }

    public CreateMixin displayName( final String displayName )
    {
        this.displayName = displayName;
        return this;
    }

    public CreateMixin schemaIcon( final SchemaIcon schemaIcon )
    {
        this.schemaIcon = schemaIcon;
        return this;
    }

    public MixinName getName()
    {
        return name;
    }

    public FormItems getFormItems()
    {
        return formItems;
    }

    public String getDisplayName()
    {
        return displayName;
    }

    public SchemaIcon getSchemaIcon()
    {
        return schemaIcon;
    }

    @Override
    public boolean equals( final Object o )
    {
        if ( this == o )
        {
            return true;
        }

        if ( !( o instanceof CreateMixin ) )
        {
            return false;
        }

        final CreateMixin that = (CreateMixin) o;
        return Objects.equal( this.name, that.name ) &&
            Objects.equal( this.formItems, that.formItems ) &&
            Objects.equal( this.displayName, that.displayName ) &&
            Objects.equal( this.schemaIcon, that.schemaIcon );
    }

    @Override
    public int hashCode()
    {
        return Objects.hashCode( this.name, this.formItems, this.displayName, this.schemaIcon );
    }

    @Override
    public void validate()
    {
        Preconditions.checkNotNull( this.name, "name cannot be null" );
        Preconditions.checkNotNull( this.formItems, "formItems cannot be null" );
        Preconditions.checkNotNull( this.displayName, "displayName cannot be null" );
    }
}
