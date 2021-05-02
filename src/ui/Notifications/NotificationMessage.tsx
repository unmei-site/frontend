import React from "react";
import './NotificationMessage.sass'
import { capitalize } from "../../utils";

type Props = {
    children: React.ReactNode
    level?: 'info' | 'success' | 'error'
    hideTime?: number
    position?: 'left' | 'center' | 'right'
} & React.DetailedHTMLProps<React.AllHTMLAttributes<HTMLDivElement>, HTMLDivElement>

type State = {
    time: number
    paused: boolean
};

class NotificationMessage extends React.Component<Props, State> {
    timer: NodeJS.Timeout | undefined;

    state = {
        time: this.props.hideTime || 5000, paused: false
    };

    onMouseOver = () => {
        this.setState({ paused: true });
    };

    onMouseOut = () => {
        this.setState({ paused: false });
    };

    onClick = () => {
        this.timer = setInterval(() => {
            this.interval(80);
        }, 1);
        this.setState({ paused: false });
    };

    interval = (step = 50) => {
        const { time, paused } = this.state;

        if(time <= 0 && this.timer)
            clearInterval(this.timer);
        if(!paused)
            this.setState({ time: time - step });
    };

    componentDidMount(): void {
        this.timer = setInterval(() => {
            this.interval(10);
        }, 10);
    };

    componentWillUnmount(): void {
        if(this.timer)
            clearTimeout(this.timer);
    }

    render() {
        const { time } = this.state;
        const {
            children,
            level,
            hideTime,
            position,
            ...props
        } = this.props;

        if(time <= 0)
            return null;

        const styleClass = level ? `Notification--${capitalize(level)}` : '';

        let style = {};
        switch(position) {
            default:
            case "left":
                break;
            case "center":
                Object.assign(style, { margin: '1rem auto 0' });
                break;
            case "right":
                Object.assign(style, { margin: `1rem calc(100% - ${window.screen.width >= 500 ? '500px' : window.screen.width}) 0` });
                break;
        }

        return (
            <div
                className={`Notification ${styleClass}`}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                onClick={this.onClick}
                style={style}
                {...props}
            >
                {children}
                <div className="Progress" style={{ width: `${time / (5000 || hideTime) * 100}%` }}/>
            </div>
        );
    }
}

export default NotificationMessage;
