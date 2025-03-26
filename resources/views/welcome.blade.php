<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MindMap Visualizer</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <header class="bg-white shadow">
            <div class="px-4 py-3 flex items-center justify-between">
                <h1 class="text-lg font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947z" clip-rule="evenodd" />
                    </svg>
                    MindMap Visualizer
                </h1>
                <button class="p-1 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <div class="md:col-span-1 space-y-4">
                <div class="bg-white p-4 rounded-lg shadow">
                    <h2 class="font-medium mb-3">Upload or Enter JSON</h2>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400" id="dropZone">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="text-sm text-gray-600">Click to upload or drag and drop<br>JSON file only</p>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Or paste JSON:</label>
                        <textarea id="jsonInput" class="w-full h-32 p-2 border rounded-lg text-sm font-mono" placeholder='{"id": "root", "text": "Main Topic",...}'></textarea>
                    </div>
                    <button id="visualizeBtn" class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                        Visualize MindMap
                    </button>
                </div>

                <div class="bg-white p-4 rounded-lg shadow">
                    <h3 class="font-medium mb-2">Sample JSON</h3>
                    <button id="loadSampleBtn" class="text-sm text-blue-600 hover:underline">Load example</button>
                </div>

                <div class="bg-white p-4 rounded-lg shadow">
                    <h3 class="font-medium mb-2">Visualization Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-700 mb-1">Node Spacing</label>
                            <input type="range" min="1" max="100" value="50" class="w-full">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-700 mb-1">Node Style</label>
                            <select class="w-full border rounded p-1 text-sm">
                                <option>Rounded</option>
                                <option>Rectangle</option>
                                <option>Circle</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-700 mb-1">Connection Style</label>
                            <select class="w-full border rounded p-1 text-sm">
                                <option>Curved</option>
                                <option>Straight</option>
                                <option>Angled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="md:col-span-3 bg-white rounded-lg shadow">
                <div id="mindmap" class="w-full h-[calc(100vh-8rem)] flex items-center justify-center text-gray-500">
                    <div class="text-center">
                        <div class="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium mb-2">No Mindmap Loaded</h3>
                        <p class="text-sm text-gray-500">Upload a JSON file or paste JSON text from the sidebar to visualize<br>your mindmap structure.</p>
                        <div class="mt-6 p-4 bg-gray-50 rounded-lg max-w-lg mx-auto">
                            <h4 class="text-sm font-medium mb-2">Example JSON Format:</h4>
                            <pre class="text-xs text-left overflow-auto p-2 bg-white rounded border">{
  "id": "root",
  "text": "Main Topic",
  "children": [
    {
      "id": "1",
      "text": "Subtopic 1",
      "children": [
        { "id": "1.1", "text": "Detail 1.1" },
        { "id": "1.2", "text": "Detail 1.2" }
      ]
    },
    {
      "id": "2",
      "text": "Subtopic 2",
      "children": []
    }
  ]
}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const dropZone = document.getElementById('dropZone');
            const jsonInput = document.getElementById('jsonInput');
            const visualizeBtn = document.getElementById('visualizeBtn');
            const loadSampleBtn = document.getElementById('loadSampleBtn');

            // Sample JSON data
            const sampleData = {
                "id": "root",
                "text": "Main Topic",
                "children": [
                    {
                        "id": "1",
                        "text": "Subtopic 1",
                        "children": [
                            { "id": "1.1", "text": "Detail 1.1" },
                            { "id": "1.2", "text": "Detail 1.2" }
                        ]
                    },
                    {
                        "id": "2",
                        "text": "Subtopic 2",
                        "children": []
                    }
                ]
            };

            loadSampleBtn.addEventListener('click', () => {
                jsonInput.value = JSON.stringify(sampleData, null, 2);
            });

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
                if (file && file.type === 'application/json') {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        jsonInput.value = e.target.result;
                    };
                    reader.readAsText(file);
                }
            });

            visualizeBtn.addEventListener('click', () => {
                try {
                    const data = JSON.parse(jsonInput.value);
                    visualize(data);
                } catch (error) {
                    alert('Invalid JSON format');
                }
            });

            function visualize(data) {
                const width = document.getElementById('mindmap').offsetWidth;
                const height = document.getElementById('mindmap').offsetHeight;
                const margin = { top: 20, right: 120, bottom: 20, left: 120 };

                // Clear previous visualization
                d3.select('#mindmap').html('');

                const svg = d3.select('#mindmap')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .style('background', 'white');

                const g = svg.append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                const tree = d3.tree()
                    .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
                    .separation((a, b) => (a.parent == b.parent ? 1.2 : 2));

                const root = d3.hierarchy(data);
                tree(root);

                // Add links with elbow connectors
                const links = g.selectAll('.link')
                    .data(root.links())
                    .join('path')
                    .attr('class', 'link')
                    .attr('fill', 'none')
                    .attr('stroke', '#666')
                    .attr('stroke-width', 1)
                    .attr('d', d => `
                        M${d.source.y},${d.source.x}
                        H${(d.source.y + d.target.y) / 2}
                        V${d.target.x}
                        H${d.target.y}
                    `);

                // Add nodes
                const nodes = g.selectAll('.node')
                    .data(root.descendants())
                    .join('g')
                    .attr('class', 'node')
                    .attr('transform', d => `translate(${d.y},${d.x})`);

                // Add background rectangles for nodes
                nodes.append('rect')
                    .attr('x', -60)
                    .attr('y', -15)
                    .attr('width', d => d.depth === 0 ? 120 : 100)
                    .attr('height', 30)
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .attr('fill', d => d.depth === 0 ? '#1a237e' : '#fff')
                    .attr('stroke', '#ccc')
                    .attr('stroke-width', 1);

                // Add text labels with centered positioning
                nodes.append('text')
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'middle')
                    .text(d => d.data.text)
                    .attr('fill', d => d.depth === 0 ? '#fff' : '#000')
                    .attr('font-size', d => d.depth === 0 ? '13px' : '11px')
                    .attr('font-weight', d => d.depth === 0 ? 'bold' : 'normal')
                    .style('font-family', 'Arial, sans-serif')
                    .style('dominant-baseline', 'middle')
                    .call(wrap, 200);

                function wrap(text, width) {
                    text.each(function() {
                        let text = d3.select(this);
                        let words = text.text().split(/\s+/).reverse();
                        let word;
                        let line = [];
                        let lineNumber = 0;
                        let lineHeight = 1.1;
                        let y = text.attr("y");
                        let dy = parseFloat(text.attr("dy"));
                        let tspan = text.text(null).append("tspan")
                            .attr("x", 0)
                            .attr("y", y)
                            .attr("dy", dy + "em");
                        
                        while (word = words.pop()) {
                            line.push(word);
                            tspan.text(line.join(" "));
                            if (tspan.node().getComputedTextLength() > width) {
                                line.pop();
                                tspan.text(line.join(" "));
                                line = [word];
                                tspan = text.append("tspan")
                                    .attr("x", 0)
                                    .attr("y", y)
                                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                                    .text(word);
                            }
                        }
                    });
                }

                // Add zoom behavior
                const zoom = d3.zoom()
                    .scaleExtent([0.5, 2])
                    .on('zoom', (event) => {
                        g.attr('transform', event.transform);
                    });

                svg.call(zoom);
            }
        });
    </script>
</body>
</html>