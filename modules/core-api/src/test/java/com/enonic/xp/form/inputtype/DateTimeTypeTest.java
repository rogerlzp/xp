package com.enonic.xp.form.inputtype;

import org.junit.Test;

import com.enonic.xp.data.Value;
import com.enonic.xp.data.ValueTypes;
import com.enonic.xp.form.InvalidTypeException;

import static org.junit.Assert.*;

public class DateTimeTypeTest
    extends BaseInputTypeTest
{
    public DateTimeTypeTest()
    {
        super( DateTimeType.INSTANCE );
    }

    @Test
    public void testName()
    {
        assertEquals( "DateTime", this.type.getName() );
    }

    @Test
    public void testToString()
    {
        assertEquals( "DateTime", this.type.toString() );
    }

    @Test
    public void testCreateProperty()
    {
        final InputTypeConfig config = newEmptyConfig();
        final Value value = this.type.createValue( "2015-01-02T22:11:00", config );

        assertNotNull( value );
        assertSame( ValueTypes.LOCAL_DATE_TIME, value.getType() );
    }

    @Test
    public void testCreateProperty_withTimezone()
    {
        final InputTypeConfig config = newFullConfig();
        final Value value = this.type.createValue( "2015-01-02T22:11:00Z", config );

        assertNotNull( value );
        assertSame( ValueTypes.DATE_TIME, value.getType() );
    }

    @Test
    public void testValidate_dateTime()
    {
        final InputTypeConfig config = newEmptyConfig();
        this.type.validate( dateTimeProperty(), config );
    }

    @Test
    public void testValidate_localDateTime()
    {
        final InputTypeConfig config = newEmptyConfig();
        this.type.validate( localDateTimeProperty(), config );
    }

    @Test(expected = InvalidTypeException.class)
    public void testValidate_invalidType()
    {
        final InputTypeConfig config = newEmptyConfig();
        this.type.validate( booleanProperty( true ), config );
    }

    private InputTypeConfig newEmptyConfig()
    {
        return InputTypeConfig.create().build();
    }

    private InputTypeConfig newFullConfig()
    {
        return InputTypeConfig.create().
            property( "timezone", "true" ).
            build();
    }
}
