import React from 'react';
import { Handle } from 'reactflow';

const LegendNode = () => {
    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <p>
                OpenFOAM Cartographer is a <strong>PoC</strong> project<br/>
                for mapping important data members<br/>
                of OpenFOAM classes, focusing on data<br/>
                that is needed for object construction.
            </p>
            <p>
                Fully reflected models will report at least<br/>
                a description, a type and a default value<br/>
                for each member.<br/>
                Only the type is guaranteed for lower level<br/>
                reflection support.
            </p>
            <p>
                Deleting nodes is a hustle, so just refresh<br/>
                if you want to switch classes/models
            </p>
            <h4>Legend</h4>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#b1dfff', marginRight: '10px' }}></div>
                    <span>Members of the Abstract Class</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#ffdf8f', marginRight: '10px' }}></div>
                    <span>Members of the Concrete Type</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                <div style={{ float: 'center', padding: '5px' }}>
                    <input style={{ border: '1px solid blue', marginRight: '10px' }} defaultValue="Default Value (*)" readOnly />
                </div>
                <div style={{ float: 'center', padding: '5px' }}>
                    <input style={{ border: '1px solid orange', marginRight: '10px' }} defaultValue="Parser Error" readOnly />
                </div>
                <div style={{ float: 'center', padding: '5px' }}>
                    <input style={{ border: '1px solid red', marginRight: '10px' }} defaultValue="Invalid OpenFOAM Syntax" readOnly />
                </div>
                <div style={{ float: 'center', padding: '5px' }}>
                    <input style={{ border: '1px solid green', marginRight: '10px'}} defaultValue="Valid OpenFOAM Syntax" readOnly />
                </div>
            </div>
        </div>
    );
};

export default LegendNode;
