import React from 'react';
import { OptionHTMLAttributes } from "react";
import { generateClassName } from "../../utils";

type Props = {} & OptionHTMLAttributes<HTMLOptionElement>

const Option = ({ children, className, ...props }: Props) => (
    <option
        className={generateClassName('Option', props.selected ? 'Selected' : '', className ?? '')}
        {...props}
    >
        {children}
    </option>
);

export default Option;