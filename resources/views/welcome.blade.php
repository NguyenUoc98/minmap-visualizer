<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mindmap Viewer</title>
    <style>
        .mindmap-container {
            width: 100%;
            height: 600px;
        }
        .mindmap-node {
            padding: 10px;
            border-radius: 5px;
            background: white;
            border: 1px solid #ccc;
            width: auto;
            min-width: 150px;
            text-align: center;
        }
        .mindmap-node.root {
            background: #667eea;
            color: white;
        }
    </style>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="mindmap" class="mindmap-container"></div>

    <script type="module">
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
            },
            // Add more nodes as needed
        ];

        const initialEdges = [
            // Add edges as needed
        ];

        function MindmapFlow() {
            return (
                <ReactFlow
                    nodes={initialNodes}
                    edges={initialEdges}
                    nodeTypes={nodeTypes}
                    fitView
                />
            );
        }

        ReactDOM.createRoot(document.getElementById('mindmap')).render(
            <React.StrictMode>
                <MindmapFlow />
            </React.StrictMode>
        );
    </script>
</body>
</html>