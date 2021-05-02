import React, { InputHTMLAttributes } from "react";
import classNames from "../../classNames";
import './Input.sass';

const Input = (restProps: InputHTMLAttributes<HTMLInputElement>) => {
    const { className, ...props } = restProps;
    return (
        <input className={classNames('Input', className)} {...props} />
    );
}

export default Input;
