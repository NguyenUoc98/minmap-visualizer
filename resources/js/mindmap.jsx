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
import styled from 'styled-components';

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

const ControlsStyled = styled(Controls)`
    button {
        border: 0;
        padding: 0.5rem;
        border-radius: 0.5rem;
        width: auto;
        height: auto;
        background: transparent;

        &:hover {
            background-color: ${(props) => props.theme.controlsBgHover};
        }

        path {
            fill: currentColor;
        }
    }

    #download-popup {
        button {
            display: flex;
            gap: 0.25rem;
            align-items: center;
            
            &:hover {
                background-color: #e5e5e5;
            }
        }
    }
`;

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
            <ControlsStyled position={"bottom-center"} orientation={"horizontal"} className="rounded-full bg-gray-200 gap-2 horizontal px-4 py-1 items-center">
                <span className="text-gray-400">|</span>
                <div className="relative">
                    <ControlButton
                        className="react-flow__controls-button text-xs gap-1 items-end"
                        onClick={() => {
                            document.querySelector('#download-popup').classList.toggle('hidden')
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        Download
                    </ControlButton>
                    <div id="download-popup" className="hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border p-2">
                        <button
                            className="block !w-full px-4 py-2 text-left rounded-md whitespace-nowrap cursor-pointer text-sm"
                            onClick={() => {
                                const { getNodes, getEdges } = useReactFlow();
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
                                }).then((dataUrl) => {
                                    const a = document.createElement('a');
                                    a.setAttribute('download', 'mindmap.png');
                                    a.setAttribute('href', dataUrl);
                                    a.click();
                                });
                            }}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                            Download PNG - No Watermark
                        </button>
                        <button
                            className="block !w-full px-4 py-2 text-left rounded-md whitespace-nowrap cursor-pointer text-sm"
                            onClick={() => {
                                const { getNodes, getEdges } = useReactFlow();
                                exportToXMind(getNodes(), getEdges());
                            }}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9 0.499976C13.9 0.279062 13.7209 0.0999756 13.5 0.0999756C13.2791 0.0999756 13.1 0.279062 13.1 0.499976V1.09998H12.5C12.2791 1.09998 12.1 1.27906 12.1 1.49998C12.1 1.72089 12.2791 1.89998 12.5 1.89998H13.1V2.49998C13.1 2.72089 13.2791 2.89998 13.5 2.89998C13.7209 2.89998 13.9 2.72089 13.9 2.49998V1.89998H14.5C14.7209 1.89998 14.9 1.72089 14.9 1.49998C14.9 1.27906 14.7209 1.09998 14.5 1.09998H13.9V0.499976ZM11.8536 3.14642C12.0488 3.34168 12.0488 3.65826 11.8536 3.85353L10.8536 4.85353C10.6583 5.04879 10.3417 5.04879 10.1465 4.85353C9.9512 4.65827 9.9512 4.34169 10.1465 4.14642L11.1464 3.14643C11.3417 2.95116 11.6583 2.95116 11.8536 3.14642ZM9.85357 5.14642C10.0488 5.34168 10.0488 5.65827 9.85357 5.85353L2.85355 12.8535C2.65829 13.0488 2.34171 13.0488 2.14645 12.8535C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L9.14646 5.14642C9.34172 4.95116 9.65831 4.95116 9.85357 5.14642ZM13.5 5.09998C13.7209 5.09998 13.9 5.27906 13.9 5.49998V6.09998H14.5C14.7209 6.09998 14.9 6.27906 14.9 6.49998C14.9 6.72089 14.7209 6.89998 14.5 6.89998H13.9V7.49998C13.9 7.72089 13.7209 7.89998 13.5 7.89998C13.2791 7.89998 13.1 7.72089 13.1 7.49998V6.89998H12.5C12.2791 6.89998 12.1 6.72089 12.1 6.49998C12.1 6.27906 12.2791 6.09998 12.5 6.09998H13.1V5.49998C13.1 5.27906 13.2791 5.09998 13.5 5.09998ZM8.90002 0.499976C8.90002 0.279062 8.72093 0.0999756 8.50002 0.0999756C8.2791 0.0999756 8.10002 0.279062 8.10002 0.499976V1.09998H7.50002C7.2791 1.09998 7.10002 1.27906 7.10002 1.49998C7.10002 1.72089 7.2791 1.89998 7.50002 1.89998H8.10002V2.49998C8.10002 2.72089 8.2791 2.89998 8.50002 2.89998C8.72093 2.89998 8.90002 2.72089 8.90002 2.49998V1.89998H9.50002C9.72093 1.89998 9.90002 1.72089 9.90002 1.49998C9.90002 1.27906 9.72093 1.09998 9.50002 1.09998H8.90002V0.499976Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                            Export .xmind file
                        </button>
                    </div>
                </div>
            </ControlsStyled>
        </ReactFlow>
    );
};

// Render
if (document.getElementById("react-flow-container")) {
    ReactDOM.render(<Flow />, document.getElementById("react-flow-container"));
}
