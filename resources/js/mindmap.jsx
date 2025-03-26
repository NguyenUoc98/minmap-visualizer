
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactFlow from 'reactflow';
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

const initialNodes = [
    {
        id: '1',
        type: 'mindmap',
        data: { label: 'Root Node', root: true },
        position: { x: 250, y: 250 }
    }
];

function MindmapApp() {
    return (
        <ReactFlow 
            nodes={initialNodes}
            nodeTypes={nodeTypes}
            fitView
        />
    );
}

if (document.getElementById('mindmap')) {
    const root = ReactDOM.createRoot(document.getElementById('mindmap'));
    root.render(<MindmapApp />);
}
