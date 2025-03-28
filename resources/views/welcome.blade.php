
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <title>MindMap Visualizer</title>
    @php
        $file = \Symfony\Component\Yaml\Yaml::parseFile(public_path('test.yaml'));
    @endphp
    <script>
        const initialNodes = @json($nodes);
        const initialEdges = @json($edges);
    </script>
    <style type="text/tailwindcss">
        /*.mindmap-node {*/
        /*    @apply flex items-center justify-start w-full h-full pl-4;*/
        /*}*/
        /*.root {*/
        /*    @apply px-4 py-2 rounded-md bg-black text-white;*/
        /*}*/
        .handle {
            @apply !bg-transparent !border-0;
        }
    </style>
    @vite(['resources/css/app.css'])
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

        <!-- Main Area -->
        <div class="flex-1 bg-gray-50">
            <div id="react-flow-container" class="h-full w-full"></div>
        </div>
    </div>
</div>

@vite(['resources/js/app.js'])
</body>
</html>
