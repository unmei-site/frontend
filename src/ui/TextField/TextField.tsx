import React from "react";
import classNames from "../../classNames";
import './TextField.sass';

const TextField = React.forwardRef(
    (restProps: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, ref: React.Ref<HTMLTextAreaElement>) => {
        const { className, ...props } = restProps;
        return (
            <textarea className={classNames('TextField', className)} ref={ref} {...props} />
        )
    })

export default TextField;
