import React from 'react';
import {
    Panel,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import exportXmind from '@mind-elixir/export-xmind';

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
            title: node.data.label,
            topics: children.length > 0 ? children : undefined
        };
    };

    const data = {
        rootTopic: createXmindData(rootNode)
    };

    console.log('Exporting XMind data:', data);
    try {
        const blob = await exportXmind(data);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mindmap.xmind';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting XMind:', error);
    }
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
                    onClick={() => exportToXMind(getNodes(), getEdges())}
                >
                    Download XMind
                </button>
            </div>
        </Panel>
    );
}

export default DownloadButton;