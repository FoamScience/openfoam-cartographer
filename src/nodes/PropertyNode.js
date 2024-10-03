import React, { useEffect, useState } from 'react';
import { Handle } from 'reactflow';

const PropertyNode = ({ data }) => {
    const { label, description, type, defaultValue } = data;
    const defaultHlColor = 'blue';
    const nonParsableHlColor = 'orange';
    const invalidHlColor = 'red';
    const validHlColor = 'green'

    // State to track the input value and validity
    const [inputValue, setInputValue] = useState(defaultValue);
    const [hlColor, setHlColor] = useState(defaultHlColor);

    const validateInput = async (value) => {
        const inputString = `${label} ${value};`;

        // Check if Tree-sitter is ready
        if (!window.TreeSitterReady) {
            console.error("Tree-sitter is not ready.");
            setHlColor(nonParsableHlColor);
            return;
        }

        try {
            const Parser = window.TreeSitter; // Access the global Tree-sitter instance
            const parser = new Parser();
            const language = await Parser.Language.load('/tree-sitter/tree-sitter-foam.wasm'); // Load your specific grammar
            parser.setLanguage(language);
            
            const tree = parser.parse(inputString);
            const isValid = tree.rootNode.hasError === false; // Adjust your validation logic as needed
            setHlColor( isValid ? validHlColor : invalidHlColor);
        } catch (error) {
            console.error("Error during validation:", error);
            setHlColor(nonParsableHlColor);
        }
    };

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        validateInput(newValue); // Validate on input change
    };

    return (
        <div className="property-node">
            <div className="node-header">{label}</div>
            <p>{description}</p>
            <div>
                <code className="c++">{type}</code>
            </div>
            <input 
                type="text" 
                value={inputValue} 
                onChange={handleInputChange} 
                placeholder="Enter value" 
                style={{
                    borderColor: hlColor, // Change color based on validity
                    borderWidth: '2px',
                }} 
            />
            <Handle type="target" position="top" />
            <Handle type="source" position="bottom" />
        </div>
    );
};

export default PropertyNode;
