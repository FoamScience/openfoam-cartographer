import React, { useEffect, useState } from 'react';
import { Handle, useReactFlow } from 'reactflow';

const OpenFoamClassNode = ({ id, data }) => {
    const { updateNodes, updateEdges, backgroundColor, openfoam_type, dictionary_name } = data;
    const header = dictionary_name ? dictionary_name : "OpenFOAM Model";
    const [endPointURL, setEndPointURL] = useState('http://0.0.0.0:18080');
    const [types, setTypes] = useState([]);
    const [typeName, setTypeName] = useState('');
    const [modelOptions, setModelOptions] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [previousResponse, setPreviousResponse] = useState(null);

    const reactFlowInstance = useReactFlow();

    const currentNode = reactFlowInstance.getNode(id);
    const parentPosition = currentNode ? currentNode.position : { x: 0, y: 0 };

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch(`${endPointURL}/supportedClasses`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (openfoam_type) {
                    setTypes([openfoam_type]);
                } else {
                    setTypes(data.types);
                }
                setSelectedModel('');
                setModelOptions([]);
                if (data.types.length > 0) {
                    setTypeName(data.types[0]);
                }
            } catch (error) {
                console.error("Error fetching types:", error);
            }
        };
        fetchTypes();
    }, [openfoam_type]);

    const handleTypeChange = async (event) => {
        const selectedType = event.target.value;
        console.log("SELECTED ", selectedType);
        setTypeName(selectedType);
        setSelectedModel('');
        setModelOptions([]);

        updateNodes([]);
        updateEdges([]);

        try {
            if (selectedType) {
                const response = await fetch(`${endPointURL}/classes/${selectedType}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPreviousResponse(data);

                const parsedTypeKey = `${selectedType}Type`;
                const modelChoices = parseModelOptions(data[parsedTypeKey]);
                setModelOptions(modelChoices);

                const newNodes = createNodesFromResponse(data, id, parsedTypeKey, parentPosition);
                const newEdges = connectNodes(newNodes, id);
                updateNodes(newNodes);
                updateEdges(newEdges);
            }
        } catch (error) {
            console.error("Error fetching class properties:", error);
        }
    };

    const handleModelChange = async (event) => {
        const selectedModel = event.target.value;
        setSelectedModel(selectedModel);

        if (!selectedModel || !previousResponse) return;

        const selectedTypeKey = `${typeName}Type`;
        var payload = JSON.stringify({
            [selectedTypeKey]: selectedModel,
        })
        if (dictionary_name && openfoam_type) {
            payload = JSON.stringify({
                [selectedTypeKey]: selectedModel,
                [dictionary_name+"Type"]: selectedModel,
            })
        }
        console.log("IS DEFINED", openfoam_type);
        const newTypeName = dictionary_name ? openfoam_type : typeName;
        console.log(newTypeName, typeName, dictionary_name, openfoam_type);

        try {
            const postResponse = await fetch(`${endPointURL}/classes/config/${newTypeName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payload,
            });
            if (!postResponse.ok) {
                throw new Error('POST request failed');
            }

            const newGetResponse = await fetch(`${endPointURL}/classes/${newTypeName}`);
            if (!newGetResponse.ok) {
                throw new Error('GET request after POST failed');
            }
            const newData = await newGetResponse.json();

            const additionalMembers = getAdditionalMembers(newData, previousResponse);

            if (additionalMembers.length > 0) {
                const newNodes = createNodesForAdditionalMembers(additionalMembers, id, parentPosition);
                const newEdges = connectNodes(newNodes, id);

                updateNodes([]);
                updateEdges([]);

                updateNodes(newNodes);
                updateEdges(newEdges);

                await fetch(`${endPointURL}/classes/config/reset`, {
                    method: 'DELETE',
                });
            }
        } catch (error) {
            console.error("Error processing model change:", error);
        }
    };

    const parseModelOptions = (typeData) => {
        if (typeData && typeData.default) {
            const match = typeData.default.match(/<<(\w+)>>\s*\(([^)]+)\)/);
            if (match) {
                const [, , items] = match;
                return items.trim().split(/\s+/);
            }
        }
        return [];
    };

    const getAdditionalMembers = (newData, oldData) => {
        const oldKeys = Object.keys(oldData);
        return Object.entries(newData).filter(([key]) => !oldKeys.includes(key));
    };

    const createNodesFromResponse = (data, parentId, parsedTypeKey, parentPosition) => {
        const radius = 300;
        const angleStep = (2 * Math.PI) / (Object.keys(data).length - 1);

        return Object.entries(data).flatMap(([key, value], index) => {
            const angle = angleStep * index;
            const nodePosition = {
                x: parentPosition.x + radius * Math.cos(angle),
                y: parentPosition.y + radius * Math.sin(angle),
            };

            if (key === parsedTypeKey || !value) return [];

            if (value.default) {
                return [{
                    id: `${parentId}-${key}`,
                    type: 'property_node',
                    position: nodePosition,
                    data: {
                        label: key,
                        defaultValue: value.default,
                        description: value.description,
                        type: value.type,
                        backgroundColor: '#b1dfff',
                    },
                }];
            } else {
                const restrictedTypeKey = Object.keys(value).find((key) => key.endsWith('Type'));
                console.log(value);
                const restrictedTypeValue = restrictedTypeKey.replace(/Type$/,'');

                return [{
                    id: `${parentId}-${key}-class`,
                    type: 'openfoam_class',
                    position: nodePosition,
                    data: {
                        updateNodes,
                        updateEdges,
                        backgroundColor: '#b1dfff',
                        openfoam_type: restrictedTypeValue,
                        dictionary_name: key,
                    },
                }];
            }
        });
    };

    const createNodesForAdditionalMembers = (additionalMembers, parentId, parentPosition) => {
        const outerRadius = 800;
        const angleStep = (2 * Math.PI) / additionalMembers.length;

        return additionalMembers.flatMap(([key, value], index) => {
            if (!value) return [];

            const div = Math.random() * Math.PI;
            const angle = -div + angleStep * index;
            const nodePosition = {
                x: parentPosition.x + outerRadius * Math.cos(angle),
                y: parentPosition.y + outerRadius * Math.sin(angle),
            };

            if (value.default) {
                return [{
                    id: `${parentId}-${key}-additional`,
                    type: 'property_node',
                    position: nodePosition,
                    data: {
                        label: key,
                        defaultValue: value.default,
                        description: value.description,
                        type: value.type,
                        isAdditional: true,
                        backgroundColor: '#ffdf8f',
                    },
                }];
            } else {
                const restrictedTypeKey = Object.keys(value).find((key) => key.endsWith('Type'));
                const restrictedTypeValue = restrictedTypeKey.replace(/Type$/, '')

                return [{
                    id: `${parentId}-${key}-additional-class`,
                    type: 'openfoam_class',
                    position: nodePosition,
                    data: {
                        updateNodes,
                        updateEdges,
                        backgroundColor: '#ffdf8f',
                        openfoam_type: restrictedTypeValue,
                        dictionary_name: key,
                    },
                }];
            }
        });
    };

    const connectNodes = (newNodes, parentId) => {
        const edges = newNodes.map((node) => ({
            id: `${parentId}-${node.id}`,
            source: parentId,
            target: node.id,
            animated: true,
        }));
        return edges;
    };

    return (
        <div
            className="openfoam-class-node"
            style={{
                width: '200px',
                padding: '10px',
                display: 'inline-block',
                backgroundColor: backgroundColor || '#ffffff',
            }}
        >
            <div className="node-header">{header}</div>
            <div className="node-body">
                <input
                    type="text"
                    value={endPointURL}
                    onChange={(e) => setEndPointURL(e.target.value)} // Update endPointURL state
                    placeholder="Enter API URL"
                    style={{ marginBottom: '10px', width: '100%' }}
                />
                <select value={typeName} onChange={handleTypeChange}>
                    <option value="" defaultValue>Select a type</option>
                    {types.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                {modelOptions.length > 0 && (
                    <div>
                        <label>Concrete type</label>
                        <select value={selectedModel} onChange={handleModelChange}>
                            <option value="" defaultValue>Select a model</option>
                            {modelOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <Handle type="target" position="top" />
            <Handle type="source" position="bottom" />
        </div>
    );
};

export default OpenFoamClassNode;
