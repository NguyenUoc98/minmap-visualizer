<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Symfony\Component\Yaml\Yaml;

class HomeController extends Controller
{
    public function home()
    {
        $file = Yaml::parseFile(public_path('test.yaml'));

        [$nodes, $edges] = $this->parseNode($file);

        return view('welcome', compact('nodes', 'edges'));
    }

    private function parseNode(
        array $node,
        int $level = 0,
        ?string $parentId = null,
        array $position = ['x' => 0, 'y' => 0],
        int $index = 0,
        ?string $color = null,
    ) {
        $spacing = 40;
        $edges   = [];

        $colors = [
            '#12ab7f',
            '#057ab0',
            '#cf846d',
            '#f9c138',
            '#53a8a5',
            '#a8529f',
            '#9fa854',
            '#49a85f',
        ];

        $isRoot = $level == 0;
        [$width, $height] = $this->getNodeDimensions($node['text'], $isRoot ? 10 : 8);

        $color     = $isRoot ? '#000' : (($level == 1) ? $colors[$index % 8] : $color);
        $textColor = ($isRoot || $level == 1) ? '#fff' : '#000';

        $currentNode = [
            'id'       => $node['id'],
            'type'     => 'mindMap',
            'data'     => [
                'label' => $node['text'],
                'root'  => $isRoot,
                'level' => $level,
            ],
            'position' => $position,
            'style'    => [
                'width'           => $width,
                'height'          => $height,
                'display'         => 'flex',
                'justifyContent'  => ($level < 2) ? 'center' : 'start',
                'paddingLeft'     => ($level < 2) ? '0' : '0.5rem',
                'alignItems'      => 'center',
                'fontSize'        => $isRoot ? '18px' : '14px',
                'fontWeight'      => $isRoot ? 700 : 400,
                'backgroundColor' => ($isRoot || $level == 1) ? $color : 'none',
                'color'           => $textColor,
                'borderRadius'    => '0.5rem',
            ],
        ];

        if ($parentId) {
            $edges[] = [
                'id'     => "e{$parentId}-{$node['id']}",
                'source' => $parentId,
                'target' => $node['id'],
                'style'  => [
                    'stroke'      => $color,
                    'strokeWidth' => 3,
                ],
            ];
        }

        $totalChildrenHeight = 0;
        $maxChildWidth       = 0;
        $childrenNodes       = [];
        $childrenYPositions  = [];

        if (!empty($node['children'])) {
            $yOffset = 0;

            foreach ($node['children'] as $index => $child) {
                $childPosition = [
                    'x' => $position['x'] + $width + $spacing * count($node['children']),
                    'y' => $position['y'] - ($totalChildrenHeight / 2) + $yOffset,
                ];
                [$nodesOfChild, $edgesOfChild, $childWidth, $childHeight] = $this->parseNode($child, $level + 1, $node['id'], $childPosition, $index, $color);
                $childrenNodes        = array_merge($childrenNodes, $nodesOfChild);
                $edges                = array_merge($edges, $edgesOfChild);
                $childHeight          = max($height, $childHeight);
                $yOffset              += $childHeight + $spacing;
                $totalChildrenHeight  += $childHeight + $spacing;
                $maxChildWidth        = max($maxChildWidth, $childWidth);
                $childrenYPositions[] = $childPosition['y'];
            }

            if ($totalChildrenHeight > 0) {
                $totalChildrenHeight -= $spacing;
            }
        }

        $width       = $width + ($maxChildWidth > 0 ? $spacing * 2 + $maxChildWidth : 0);
        $childHeight = $totalChildrenHeight > 0 ? $totalChildrenHeight : $height;

        if (!empty($childrenYPositions)) {
            $minY                         = min($childrenYPositions);
            $maxY                         = max($childrenYPositions);
            $currentNode['position']['y'] = ($minY + $maxY) / 2;
        }
        $nodes = array_merge([$currentNode], $childrenNodes);
        return [$nodes, $edges, $width, $childHeight];
    }

    private function getNodeDimensions(string $text, int $fontsize = 8)
    {
        $baseHeight      = 40;
        $charWidth       = $fontsize;
        $minWidth        = 100;
        $calculatedWidth = max(Str::length($text) * $charWidth, $minWidth);

        return [
            $calculatedWidth,
            $baseHeight,
        ];
    }
}
