import React from "react";
import './Select.sass';
import classNames from "../../classNames";

type Props = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>

const Select = ({ children, className, ...props }: Props) => (
    <select {...props} className={classNames('Select', className)}>
        {children}
    </select>
);

export default Select;
