import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Position,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = {
    custom: CustomNode,
};

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
};

const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
            <MiniMap />
        </ReactFlow>
    );
};

if (document.getElementById('react-flow-container')) {
    ReactDOM.render(<Flow/>, document.getElementById('react-flow-container'));
}