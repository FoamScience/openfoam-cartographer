import React, { useState, useEffect, useRef } from 'react';
import { Handle } from 'reactflow';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import '../highlight-custom.css'; 

const PropertyNode = ({ data }) => {
    const { label, description, type, defaultValue, backgroundColor } = data;
    const defaultHlColor = 'blue';
    const nonParsableHlColor = 'orange';
    const invalidHlColor = 'red';
    const validHlColor = 'green';
    const inputRef = useRef(null);
    const codeRef = useRef(null);

    const [inputValue, setInputValue] = useState(defaultValue);
    const [hlColor, setHlColor] = useState(defaultHlColor);

    const validateInput = async (value) => {
        const inputString = `${label} ${value};`;

        if (!window.TreeSitterReady) {
            console.error("Tree-sitter is not ready.");
            setHlColor(nonParsableHlColor);
            return;
        }

        try {
            const Parser = window.TreeSitter;
            const parser = new Parser();
            const language = await Parser.Language.load('/tree-sitter/tree-sitter-foam.wasm');
            parser.setLanguage(language);

            const tree = parser.parse(inputString);
            const isValid = tree.rootNode.hasError === false;
            setHlColor(isValid ? validHlColor : invalidHlColor);
        } catch (error) {
            console.error("Error during validation:", error);
            setHlColor(nonParsableHlColor);
        }
    };

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        validateInput(newValue);
    };

    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current);
        }
    }, [type]);

    return (
        <div
            className="property-node"
            style={{
                width: '250px',
                backgroundColor: backgroundColor || '#ffffff',
                padding: '10px',
                borderRadius: '5px',
                wordWrap: 'break-word',
            }}
        >
            <div className="node-header">{label}</div>
            <p>{description}</p>
            <div style={{ padding: "2px" }}>
                <code ref={codeRef} className="cpp">
                    {type}
                </code>
            </div>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter value"
                style={{
                    borderColor: hlColor,
                    borderWidth: '2px',
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            />
            <Handle type="target" position="top" />
        </div>
    );
};

export default PropertyNode;
