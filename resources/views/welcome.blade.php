
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <title>MindMap Visualizer</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-white">
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="border-b border-gray-200 bg-white px-4 py-3">
            <div class="flex items-center">
                <h1 class="text-lg font-semibold flex items-center">
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    MindMap Visualizer
                </h1>
                <div class="ml-auto">
                    <button type="button" class="p-1.5 rounded-full hover:bg-gray-100">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8v8m0-8h.01M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <div class="flex flex-1">
            <!-- Left Sidebar -->
            <div class="w-80 border-r border-gray-200 bg-white p-4 flex flex-col">
                <h2 class="font-medium mb-4">Upload or Enter JSON</h2>
                
                <!-- Upload Area -->
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    <p class="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p class="text-xs text-gray-500">JSON file only</p>
                </div>

                <!-- JSON Input -->
                <div class="flex-1">
                    <p class="text-sm font-medium mb-2">Or paste JSON:</p>
                    <textarea 
                        id="jsonInput"
                        class="w-full h-40 p-2 text-sm border rounded-lg"
                        placeholder='{"id": "root", "text": "Main Topic", "children": [...]}'
                    ></textarea>
                </div>

                <!-- Visualize Button -->
                <button 
                    class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    onclick="visualizeMindmap()"
                >
                    Visualize MindMap
                </button>

                <!-- Sample JSON -->
                <div class="mt-4">
                    <p class="text-sm font-medium mb-2">Sample JSON</p>
                    <button class="text-sm text-blue-600 hover:underline">Load example</button>
                </div>
            </div>

            <!-- Main Area -->
            <div class="flex-1 bg-gray-50 p-4" id="mindmap">
                <div class="flex items-center justify-center h-full text-center text-gray-500">
                    <div>
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        <h3 class="text-lg font-medium mb-2">No Mindmap Loaded</h3>
                        <p class="text-sm">
                            Upload a JSON file or paste JSON text from the sidebar to visualize<br>
                            your mindmap structure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
