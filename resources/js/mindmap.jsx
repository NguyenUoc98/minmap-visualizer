import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import html2canvas from 'html2canvas';

const MindMapNode = ({ data }) => {
    return (
        <div className={`mindmap-node ${data.root ? 'root' : ''}`}>
            {data.label}

            <Handle
                type="target"
                position={Position.Left}
                className="handle"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="handle"
            />
        </div>
    );
};

const nodeTypes = {
    mindMap: MindMapNode
};

const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const handleDownload = async () => {
        const element = document.querySelector('.react-flow');
        if (!element) return;
        
        try {
            const canvas = await html2canvas(element);
            const data = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = data;
            link.download = 'mindmap.png';
            link.click();
        } catch (error) {
            console.error('Error downloading mindmap:', error);
        }
    };

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
        >
            <Background />
            <Controls />
            <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Download PNG
                </button>
            </div>
        </ReactFlow>
    );
};

// Render
if (document.getElementById('react-flow-container')) {
    ReactDOM.render(<Flow/>, document.getElementById('react-flow-container'));
}
