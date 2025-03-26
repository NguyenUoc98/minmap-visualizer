<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindMap Visualizer</title>
    @vite('resources/css/app.css')
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto p-4">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-semibold">MindMap Visualizer</h1>
            <div class="text-gray-600 cursor-pointer" id="helpBtn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="md:col-span-1 space-y-4">
                <div class="bg-white p-4 rounded-lg shadow">
                    <h2 class="font-medium mb-3">Upload or Enter JSON</h2>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer" id="dropZone">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="text-sm text-gray-600">Click to upload or drag and drop<br>JSON file only</p>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Or paste JSON:</label>
                        <textarea id="jsonInput" class="w-full h-32 p-2 border rounded-lg text-sm" placeholder="Paste your JSON here..."></textarea>
                    </div>
                    <button id="visualizeBtn" class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        Visualize MindMap
                    </button>
                </div>

                <div class="bg-white p-4 rounded-lg shadow">
                    <h2 class="font-medium mb-3">Visualization Settings</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Node Spacing</label>
                            <input type="range" id="nodeSpacing" min="1" max="100" value="50" class="w-full">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Node Style</label>
                            <select id="nodeStyle" class="w-full border rounded-lg p-2">
                                <option value="rounded">Rounded</option>
                                <option value="rectangle">Rectangle</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Connection Style</label>
                            <select id="connectionStyle" class="w-full border rounded-lg p-2">
                                <option value="curved">Curved</option>
                                <option value="straight">Straight</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="md:col-span-3 bg-white rounded-lg shadow p-4">
                <div id="mindmap" class="w-full h-[800px] border rounded-lg"></div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const width = document.getElementById('mindmap').clientWidth;
            const height = document.getElementById('mindmap').clientHeight;
            
            const svg = d3.select('#mindmap')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
            
            const g = svg.append('g');
            
            // Add zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([0.1, 4])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                });
            
            svg.call(zoom);
            
            function visualize(data) {
                // Clear previous visualization
                g.selectAll('*').remove();
                
                const root = d3.hierarchy(data);
                
                const treeLayout = d3.tree()
                    .size([height - 100, width - 300]);
                
                const nodeSpacing = document.getElementById('nodeSpacing').value;
                treeLayout.nodeSize([nodeSpacing, nodeSpacing * 2]);
                
                const links = root.links();
                const nodes = root.descendants();
                
                // Draw links
                const link = g.selectAll('.link')
                    .data(links)
                    .enter()
                    .append('path')
                    .attr('class', 'link')
                    .attr('fill', 'none')
                    .attr('stroke', '#ccc')
                    .attr('d', d3.linkHorizontal()
                        .x(d => d.y)
                        .y(d => d.x));
                
                // Draw nodes
                const node = g.selectAll('.node')
                    .data(nodes)
                    .enter()
                    .append('g')
                    .attr('class', 'node')
                    .attr('transform', d => `translate(${d.y},${d.x})`);
                
                // Add node circles
                node.append('circle')
                    .attr('r', 5)
                    .attr('fill', '#fff')
                    .attr('stroke', '#999');
                
                // Add node labels
                node.append('text')
                    .attr('dy', '0.31em')
                    .attr('x', d => d.children ? -8 : 8)
                    .attr('text-anchor', d => d.children ? 'end' : 'start')
                    .text(d => d.data.text || d.data.id)
                    .attr('font-size', '12px');
            }
            
            // Handle file upload
            const dropZone = document.getElementById('dropZone');
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('border-blue-500');
            });
            
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('border-blue-500');
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-blue-500');
                
                const file = e.dataTransfer.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            visualize(data);
                        } catch (error) {
                            alert('Invalid JSON file');
                        }
                    };
                    reader.readAsText(file);
                }
            });
            
            // Handle visualize button click
            document.getElementById('visualizeBtn').addEventListener('click', () => {
                const jsonInput = document.getElementById('jsonInput').value;
                try {
                    const data = JSON.parse(jsonInput);
                    visualize(data);
                } catch (error) {
                    alert('Invalid JSON');
                }
            });
            
            // Handle settings changes
            document.getElementById('nodeSpacing').addEventListener('input', () => {
                const jsonInput = document.getElementById('jsonInput').value;
                try {
                    const data = JSON.parse(jsonInput);
                    visualize(data);
                } catch (error) {}
            });
        });
    </script>
</body>
</html>
