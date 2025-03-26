
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const MindmapNode = ({ data }) => {
    return (
        <div className={`mindmap-node ${data.root ? 'root' : ''}`}>
            {data.label}
        </div>
    );
};

const nodeTypes = {
    mindmap: MindmapNode
};

// Sample JSON data structure
const sampleData = {
    "name": "Root Topic",
    "children": [
        {
            "name": "Child 1",
            "children": [
                { "name": "Grandchild 1.1" },
                { "name": "Grandchild 1.2" }
            ]
        },
        {
            "name": "Child 2",
            "children": [
                { "name": "Grandchild 2.1" }
            ]
        }
    ]
};

function processJsonToNodes(json, parentX = 0, parentY = 0, level = 0) {
    const nodes = [];
    const edges = [];
    let currentId = nodes.length + 1;
    
    const node = {
        id: currentId.toString(),
        type: 'mindmap',
        data: { 
            label: json.name,
            root: level === 0 
        },
        position: { x: parentX, y: parentY }
    };
    
    nodes.push(node);
    
    if (json.children) {
        const spacing = 200;
        const childrenWidth = (json.children.length - 1) * spacing;
        
        json.children.forEach((child, index) => {
            const childX = parentX - childrenWidth/2 + index * spacing;
            const childY = parentY + 100;
            
            const [childNodes, childEdges] = processJsonToNodes(
                child,
                childX,
                childY,
                level + 1
            );
            
            const childId = (nodes.length + childNodes.length).toString();
            edges.push({
                id: `e${currentId}-${childId}`,
                source: currentId.toString(),
                target: childId
            });
            
            nodes.push(...childNodes);
            edges.push(...childEdges);
        });
    }
    
    return [nodes, edges];
}

function MindmapApp() {
    const [nodes, edges] = processJsonToNodes(sampleData);
    
    return (
        <ReactFlow 
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
        >
            <Controls />
        </ReactFlow>
    );
}

if (document.getElementById('mindmap')) {
    const root = ReactDOM.createRoot(document.getElementById('mindmap'));
    root.render(<MindmapApp />);
}
