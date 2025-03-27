
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

function processJsonToNodes(json, parentX = 0, parentY = 0, level = 0) {
    const nodes = [];
    const edges = [];
    let currentId = nodes.length + 1;
    
    const node = {
        id: currentId.toString(),
        type: 'mindmap',
        data: { 
            label: json.text || json.name,
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
    const [jsonInput, setJsonInput] = useState('');
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [error, setError] = useState('');

    const handleVisualize = () => {
        try {
            const jsonData = JSON.parse(jsonInput);
            const [processedNodes, processedEdges] = processJsonToNodes(jsonData);
            setNodes(processedNodes);
            setEdges(processedEdges);
            setError('');
        } catch (e) {
            setError('Invalid JSON format');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="p-4">
                <textarea 
                    className="w-full p-2 border rounded"
                    rows="6"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='Enter JSON data here...'
                />
                {error && <div className="text-red-500 mt-2">{error}</div>}
                <button 
                    onClick={handleVisualize}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Visualize Mindmap
                </button>
            </div>
            <div style={{ height: '500px' }}>
                <ReactFlow 
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}

// Render main mindmap
if (document.getElementById('mindmap')) {
    const root = ReactDOM.createRoot(document.getElementById('mindmap'));
    root.render(<MindmapApp />);
}

// Render controls
if (document.getElementById('mindmap-controls')) {
    const controlsRoot = ReactDOM.createRoot(document.getElementById('mindmap-controls'));
    controlsRoot.render(
        <button 
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={() => document.dispatchEvent(new Event('visualize-mindmap'))}
        >
            Visualize MindMap
        </button>
    );
}
