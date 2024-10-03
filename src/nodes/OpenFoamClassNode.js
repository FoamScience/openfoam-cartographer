import React, { useEffect, useState } from 'react';
import { Handle, useReactFlow } from 'reactflow';

const OpenFoamClassNode = ({ id, data }) => {
    const { updateNodes, updateEdges } = data; // Destructure updateNodes and updateEdges from data
    const { setEdges } = useReactFlow();
    const [types, setTypes] = useState([]);
    const [typeName, setTypeName] = useState("");

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch('http://0.0.0.0:18080/supportedClasses');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json(); // Parse JSON response
                setTypes(data.types);
                if (data.types.length > 0) {
                    setTypeName(data.types[0]);
                }
            } catch (error) {
                console.error("Error fetching types:", error);
            }
        };
        fetchTypes();
    }, []);

    const handleTypeChange = async (event) => {
        const selectedType = event.target.value;
        setTypeName(selectedType);

        try {
            const response = await fetch(`http://0.0.0.0:18080/classes/${selectedType}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); // Parse JSON response
            const newNodes = createNodesFromResponse(data, id);
            const newEdges = connectNodes(newNodes, id); // Capture new edges returned from connectNodes
            updateNodes(newNodes); // Update nodes
            updateEdges(newEdges); // Update edges
        } catch (error) {
            console.error("Error fetching class properties:", error);
        }
    };

    const createNodesFromResponse = (data, parentId) => {
        const radius = 250; // Adjust radius as needed
        const angleStep = (2 * Math.PI) / Object.keys(data).length; // Divide circle by number of nodes

        return Object.entries(data).map(([key, value], index) => {
            const angle = angleStep * index;
            return {
                id: `${parentId}-${key}`,
                type: 'property_node',
                position: {
                    x: radius * Math.cos(angle), // Position X
                    y: radius * Math.sin(angle), // Position Y
                },
                data: {
                    label: key,
                    defaultValue: value.default,
                    description: value.description,
                    type: value.type,
                },
            };
        });
    };

    const connectNodes = (newNodes, parentId) => {
        const edges = newNodes.map((node) => ({
            id: `${parentId}-${node.id}`,
            source: parentId,
            target: node.id,
            animated: true,
        }));
        return edges; // Return new edges for updateEdges
    };

    return (
        <div className="openfoam-class-node">
            <div className="node-header">OpenFOAM Class</div>
            <div className="node-body">
                <select value={typeName} onChange={handleTypeChange}>
                    {types.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            <Handle type="target" position="top" />
            <Handle type="source" position="bottom" />
        </div>
    );
};

export default OpenFoamClassNode;
