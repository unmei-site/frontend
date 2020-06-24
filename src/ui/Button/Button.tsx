import React, {ButtonHTMLAttributes} from "react";
import './Button.sass';
import classNames from "../../classNames";

const Button = (restProps: ButtonHTMLAttributes<HTMLElement>) => {
    const { className, children, ...props } = restProps;
    return (
        <button className={classNames('Button', className)} {...props}>
            {children}
        </button>
    )
}

export default Button;