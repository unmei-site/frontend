import React from "react";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    selected?: boolean
}

const TabItem = ({ children, selected, ...props }: Props) => (
    <div className={selected ? 'TabItem Selected' : 'TabItem'} {...props}>
        {children}
    </div>
);

export default TabItem;
