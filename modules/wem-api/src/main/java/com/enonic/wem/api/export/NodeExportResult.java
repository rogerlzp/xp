package com.enonic.wem.api.export;

import java.util.List;
import java.util.Set;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import com.enonic.wem.api.node.NodePath;
import com.enonic.wem.api.node.NodePaths;
import com.enonic.wem.api.util.BinaryReference;
import com.enonic.wem.api.vfs.VirtualFile;

public class NodeExportResult
{
    private final boolean dryRun;

    private final VirtualFile exportRoot;

    private final NodePaths exportedNodes;

    private final List<ExportError> exportErrors;

    private final List<String> exportedBinaries;

    private NodeExportResult( final Builder builder )
    {
        dryRun = builder.dryRun;
        exportedNodes = NodePaths.from( builder.nodePaths );
        exportErrors = builder.exportErrors;
        exportedBinaries = builder.exportedBinaries;
        this.exportRoot = builder.exportRoot;
    }

    public boolean isDryRun()
    {
        return dryRun;
    }

    public NodePaths getExportedNodes()
    {
        return exportedNodes;
    }

    public List<ExportError> getExportErrors()
    {
        return exportErrors;
    }

    public List<String> getExportedBinaries()
    {
        return exportedBinaries;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public int size()
    {
        return exportedNodes.getSize();
    }


    public static final class Builder
    {
        private boolean dryRun;

        private final List<ExportError> exportErrors = Lists.newArrayList();

        private final List<String> exportedBinaries = Lists.newArrayList();

        private final Set<NodePath> nodePaths = Sets.newHashSet();

        private VirtualFile exportRoot;

        private Builder()
        {
        }

        public Builder dryRun( boolean dryRun )
        {
            this.dryRun = dryRun;
            return this;
        }

        public Builder addBinary( final NodePath nodePath, final BinaryReference binaryReference )
        {
            this.exportedBinaries.add( nodePath.toString() + "[" + binaryReference.toString() + "]" );
            return this;
        }

        public Builder addNodePath( final NodePath nodePath )
        {
            this.nodePaths.add( nodePath );
            return this;
        }

        public Builder addError( final ExportError error )
        {
            this.exportErrors.add( error );
            return this;
        }

        public Builder exportRoot( final VirtualFile exportRoot )
        {
            this.exportRoot = exportRoot;
            return this;
        }

        public NodeExportResult build()
        {
            return new NodeExportResult( this );
        }
    }

}
