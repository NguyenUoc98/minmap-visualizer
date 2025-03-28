import React from 'react';
import {
    Panel,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl) {
    const a = document.createElement('a');

    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

function DownloadButton() {
    const { getNodes } = useReactFlow();
    const onClick = () => {
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
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer" onClick={onClick}>
                Download Image
            </button>
        </Panel>
    );
}

export default DownloadButton;