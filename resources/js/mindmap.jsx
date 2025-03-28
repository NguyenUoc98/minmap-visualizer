import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DownloadButton from "./DownloadButton";

const MindMapNode = ({ data }) => {
    return (
        <div className={`mindmap-node ${data.root ? "root" : ""}`}>
            {data.label}

            <Handle type="target" position={Position.Left} className="handle" />
            <Handle
                type="source"
                position={Position.Right}
                className="handle"
            />
        </div>
    );
};

const nodeTypes = {
    mindMap: MindMapNode,
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
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.1}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
        >
            <Background />
            <Controls />
            <DownloadButton />
        </ReactFlow>
    );
};

// Render
if (document.getElementById("react-flow-container")) {
    ReactDOM.render(<Flow />, document.getElementById("react-flow-container"));
}
