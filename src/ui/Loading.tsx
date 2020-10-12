import React from 'react';
// @ts-ignore
import Loader from 'react-loader-spinner'

const Loading: React.FC = () => (
    <div style={{ textAlign: 'center' }}>
        <Loader color='#aaa' type='Rings'/>
    </div>
);

export default Loading;
