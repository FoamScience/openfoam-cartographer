import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import OpenFoamClassNode from './nodes/OpenFoamClassNode';
import PropertyNode from './nodes/PropertyNode';

const initialNodes = [
    {
        id: '1',
        type: 'openfoam_class',
        position: { x: 0, y: 0 },
        data: {}, // This will hold the updateNodes and updateEdges functions
    },
];

const initialEdges = [];

const nodeTypes = {
    openfoam_class: OpenFoamClassNode,
    property_node: PropertyNode,
};

const Flow = () => {
    const [nodes, setNodes] = React.useState(initialNodes);
    const [edges, setEdges] = React.useState(initialEdges);

    // Function to update nodes
    const updateNodes = (newNodes) => {
        setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    };

    // Function to update edges
    const updateEdges = (newEdges) => {
        setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    };

    // Handle edge connection
    const onConnect = (params) => setEdges((eds) => [...eds, params]);

    // Map over nodes to pass the updateNodes and updateEdges functions
    const mappedNodes = nodes.map((node) =>
        node.type === 'openfoam_class'
            ? { ...node, data: { ...node.data, updateNodes, updateEdges } } // Pass updateNodes and updateEdges as part of data
            : node
    );

    return (
        <div style={{ height: '100vh' }}>
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
