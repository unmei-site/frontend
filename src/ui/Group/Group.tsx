import React, {HTMLAttributes} from "react";
import classNames from "../../classNames";
import './Group.sass'

interface Props extends HTMLAttributes<HTMLElement> {
    title: string
    direction?: 'column' | 'row'
}

const Group = (restProps: Props) => {
    const { title, direction, className, children, ...props } = restProps;
    let style: React.CSSProperties = {};
    if(direction === 'column') {
        style = {
            display: 'flex',
            flexDirection: 'column'
        }
    }
    return (
        <div className={classNames('Group', className)} {...props}>
            <div className="Group__Title">{title}</div>
            <div style={style} className={'Group__Content'}>
                {children}
            </div>
        </div>
    )
}

export default Group;
