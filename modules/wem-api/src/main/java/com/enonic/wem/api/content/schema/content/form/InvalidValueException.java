package com.enonic.wem.api.content.schema.content.form;


import com.enonic.wem.api.content.data.Property;
import com.enonic.wem.api.content.data.Value;

public class InvalidValueException
    extends RuntimeException
{
    public InvalidValueException( Property property, final String message )
    {
        super( buildMessage( property, message ) );
    }

    public InvalidValueException( Value value, final String message )
    {
        super( buildMessage( value, message ) );
    }

    private static String buildMessage( final Property property, final String message )
    {
        return "Invalid value in [" + property + "]: " + message + ": " + property.getObject();
    }

    private static String buildMessage( final Value value, final String message )
    {
        return "Invalid value: " + message + ": " + value.getObject();
    }
}
