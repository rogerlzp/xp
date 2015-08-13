package com.enonic.xp.form.inputtype;

import com.google.common.annotations.Beta;

import com.enonic.xp.data.Property;
import com.enonic.xp.data.Value;

@Beta
public interface InputType
{
    String getName();

    Value createValue( String value, InputTypeConfig config );

    void validate( Property property, InputTypeConfig config );
}
