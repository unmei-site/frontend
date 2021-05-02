import { SelectHTMLAttributes } from "react"
import { generateClassName } from "../../utils";
import './Select.sass';

type Props = {} & SelectHTMLAttributes<HTMLSelectElement>

const Select = ({ children, className, ...props }: Props) => (
    <select
        className={generateClassName('Select', className ?? '')}
        {...props}
    >
        {children}
    </select>
);

export default Select;