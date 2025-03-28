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
    console.log('Starting XMind export...');
    console.log('Nodes:', nodes);
    console.log('Edges:', edges);
    
    const rootNode = nodes.find(node => node.data.root);
    console.log('Root node:', rootNode);
    
    const createXmindData = (node) => {
        console.log('Processing node:', node);
        const childEdges = edges.filter(edge => edge.source === node.id);
        console.log('Child edges:', childEdges);
        
        const children = childEdges.map(edge => {
            const childNode = nodes.find(n => n.id === edge.target);
            return createXmindData(childNode);
        });
        
        const nodeData = {
            title: node.data.label,
            children: children.length > 0 ? children : undefined
        };
        console.log('Created node data:', nodeData);
        return nodeData;
    };

    const mindmapData = {
        root: createXmindData(rootNode)
    };
    
    console.log('Final mindmap data:', mindmapData);
    
    try {
        console.log('Calling exportXmind...');
        const result = await exportXmind(mindmapData);
        console.log('Export result:', result);
        
        if (result instanceof Blob) {
            const url = URL.createObjectURL(result);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mindmap.xmind';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('Download initiated');
        } else {
            console.error('Export did not return a Blob:', result);
        }
    } catch (error) {
        console.error('Error in XMind export:', error);
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