import React, { HTMLAttributes } from "react";
import classNames from "../../classNames";
import './Group.sass'

interface Props extends HTMLAttributes<HTMLElement> {
    children: React.ReactNode[] | React.ReactNode
    title?: string
    direction?: 'column' | 'row'
    columns?: number
}

const Group = (restProps: Props) => {
    const { title, direction, columns, className, children, ...props } = restProps;
    let style: React.CSSProperties = {};
    if(direction === 'column') {
        style = {
            display: 'flex',
            flexDirection: 'column'
        }
    }
    if(!children) return null;
    if(columns && columns > 1) {
        // TODO
    }
    return (
        <div className={classNames('Group', className)} {...props}>
            {title && <div className="Group__Title">{title}</div>}
            <div style={style} className={'Group__Content'}>
                {children}
            </div>
        </div>
    )
}

export default Group;
