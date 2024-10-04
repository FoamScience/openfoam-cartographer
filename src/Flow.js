import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import OpenFoamClassNode from './nodes/OpenFoamClassNode';
import PropertyNode from './nodes/PropertyNode';
import LegendNode from './nodes/LegendNode';

const initialNodes = [
    {
        id: '1',
        type: 'openfoam_class',
        position: { x: 0, y: 0 },
        data: {},
    },
    {
        id: 'legend-node',
        type: 'legend_node',
        position: { x: -45, y: 500 },
        data: {},
    },
];

const initialEdges = [];

const nodeTypes = {
    openfoam_class: OpenFoamClassNode,
    property_node: PropertyNode,
    legend_node: LegendNode,
};

const Flow = () => {
    const [nodes, setNodes] = React.useState(initialNodes);
    const [edges, setEdges] = React.useState(initialEdges);

    const updateNodes = (newNodes = []) => {
        if (!Array.isArray(newNodes)) {
            console.error("newNodes is not an array:", newNodes);
            return;
        }
        setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    };

    const updateEdges = (newEdges = []) => {
        if (!Array.isArray(newEdges)) {
            console.error("newEdges is not an array:", newEdges);
            return;
        }
        setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    };

    const onConnect = (params) => setEdges((eds) => [...eds, params]);

    const mappedNodes = nodes.map((node) =>
        node.type === 'openfoam_class'
            ? { ...node, data: { ...node.data, updateNodes, updateEdges } }
            : node
    );

    return (
        <div
            style={{
                height: '100vh',
            }}
        >
            <ReactFlow
                nodes={mappedNodes}
                edges={edges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default Flow;
