import React from "react";
import './Modal.sass';

type Props = {
    children: React.ReactChild | React.ReactChild[]
}

const Popout = ({ children }: Props) => (
    <div className="Modal__Overlay">
        {children}
    </div>
);

export default Popout;
