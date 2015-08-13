package com.enonic.xp.form.inputtype;

import com.enonic.xp.data.Property;
import com.enonic.xp.data.Value;
import com.enonic.xp.data.ValueTypes;

final class DoubleType
    extends InputType
{
    public DoubleType()
    {
        super( InputTypeName.DOUBLE );
    }

    @Override
    public void checkBreaksRequiredContract( final Property property )
    {
        validateNotNull( property, property.getDouble() );
    }

    @Override
    public void checkTypeValidity( final Property property )
    {
        validateType( property, ValueTypes.DOUBLE );
    }

    @Override
    public Value createPropertyValue( final String value, final InputTypeConfig config )
    {
        return Value.newDouble( ValueTypes.DOUBLE.convert( value ) );
    }
}