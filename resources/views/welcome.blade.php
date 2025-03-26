
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mindmap Visualizer</title>
    <style>
        .mindmap-container {
            width: 100%;
            min-height: 100vh;
            padding: 20px;
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
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/mindmap.jsx'])
</head>
<body class="bg-gray-50">
    <div id="mindmap" class="mindmap-container"></div>
</body>
</html>
