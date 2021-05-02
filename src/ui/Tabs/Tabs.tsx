import React from "react";
import './Tabs.sass';

const Tabs = ({ children }: { children: React.ReactNode[] }) => (
    <div className={'Tabs'}>
        {children}
    </div>
)

export default Tabs;
