import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
    ReactFlow,
    Background,
    Controls,
    ControlButton,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
} from "@xyflow/react";
import { toPng } from 'html-to-image';
import { data2Xmind } from '@mind-elixir/export-xmind';
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

function downloadImage(dataUrl) {
    const a = document.createElement('a');
    a.setAttribute('download', 'mindmap.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

async function exportToXMind(nodes, edges) {
    const rootNode = nodes.find(node => node.data.root);
    
    const createXmindData = (node) => {
        const childEdges = edges.filter(edge => edge.source === node.id);
        const children = childEdges.map(edge => {
            const childNode = nodes.find(n => n.id === edge.target);
            return createXmindData(childNode);
        });
        
        return {
            topic: node.data.label,
            children: children.length > 0 ? children : undefined
        };
    };

    const mindmapData = {
        nodeData: {
            topic: rootNode.data.label,
            children: createXmindData(rootNode).children
        }
    };

    try {
        const blob = await data2Xmind(JSON.parse(JSON.stringify(mindmapData)));
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mindmap.xmind';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error in XMind export:', error);
    }
}

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
            <Controls position={"bottom-center"} orientation={"horizontal"}>
                <ControlButton onClick={() => {
                    const { getNodes, getEdges } = useReactFlow();
                    exportToXMind(getNodes(), getEdges());
                }}>
                    XMind
                </ControlButton>
                <ControlButton onClick={() => {
                    const nodesBounds = getNodesBounds(getNodes());
                    const mindMapWidth = nodesBounds.x + nodesBounds.width;
                    const mindMapHeight = nodesBounds.y + nodesBounds.height;
                    
                    const viewport = getViewportForBounds(
                        nodesBounds,
                        mindMapWidth,
                        mindMapHeight,
                        0.5,
                        2,
                        0
                    );

                    toPng(document.querySelector('.react-flow__viewport'), {
                        backgroundColor: '#fff',
                        width: mindMapWidth,
                        height: mindMapHeight,
                        quality: 1.0,
                        pixelRatio: 2,
                        style: {
                            width: mindMapWidth,
                            height: mindMapHeight,
                            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                        },
                    }).then(downloadImage);
                }}>
                    PNG
                </ControlButton>
            </Controls>
            <DownloadButton />
        </ReactFlow>
    );
};

// Render
if (document.getElementById("react-flow-container")) {
    ReactDOM.render(<Flow />, document.getElementById("react-flow-container"));
}
