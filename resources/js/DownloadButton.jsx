import React from 'react';
import {
    Panel,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';

function downloadImage(dataUrl) {
    const a = document.createElement('a');
    a.setAttribute('download', 'mindmap.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

async function downloadXMind(nodes, edges) {
    const zip = new JSZip();
    
    // Create content.json for xmind
    const rootNode = nodes.find(node => node.data.root);
    
    const createXmindNode = (node) => {
        const childEdges = edges.filter(edge => edge.source === node.id);
        const children = childEdges.map(edge => {
            const childNode = nodes.find(n => n.id === edge.target);
            return createXmindNode(childNode);
        });
        
        return {
            title: node.data.label,
            children: children.length > 0 ? children : undefined
        };
    };

    const content = {
        rootTopic: createXmindNode(rootNode),
        theme: {
            properties: {}
        }
    };

    // Add required xmind files
    zip.file("content.json", JSON.stringify({ content: [content] }));
    zip.file("metadata.json", JSON.stringify({
        creator: "MindMap Visualizer",
        version: "1.0"
    }));

    // Generate and download the zip file
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.xmind';
    a.click();
    URL.revokeObjectURL(url);
}

function DownloadButton() {
    const { getNodes, getEdges } = useReactFlow();
    const downloadAsImage = () => {
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
    };

    return (
        <Panel position="top-right">
            <div className="flex gap-2">
                <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer" 
                    onClick={downloadAsImage}
                >
                    Download PNG
                </button>
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                    onClick={() => downloadXMind(getNodes(), getEdges())}
                >
                    Download XMind
                </button>
            </div>
        </Panel>
    );
}

export default DownloadButton;