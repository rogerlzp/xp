package com.enonic.wem.api.resource;

import java.util.List;

import com.google.common.io.ByteSource;

public interface Resource
{
    public ResourceKey getKey();

    public long getSize();

    public long getTimestamp();

    public ByteSource getByteSource();

    public String readAsString();

    public List<String> readLines();
}
