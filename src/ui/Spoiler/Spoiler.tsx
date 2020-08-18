import React from "react";
import './Spoiler.sass'

type Props = {
    children?: React.ReactNode
}

type State = {
    expand: boolean
}

class Spoiler extends React.Component<Props, State> {
    state = { 
        expand: false
    };

    render() {
        const { expand } = this.state;
        const { children } = this.props;

        return (
            <div 
                className="Spoiler"
                onClick={() => this.setState({ expand: !expand })}
                style={{ fontStyle: expand ? 'normal' : 'italic' }}
            >
                    {expand ? children : '[Спойлер]'}
            </div>
        )
    }
}

export default Spoiler;