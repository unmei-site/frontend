import React from "react";
// @ts-ignore
import Loader from 'react-loader-spinner';
import Popout from "../../ui/Modal/Popout";

const LoadingModal = () => (
    <Popout>
        <Loader color='#aaa' type='Rings'/>
    </Popout>
);

export default LoadingModal;
