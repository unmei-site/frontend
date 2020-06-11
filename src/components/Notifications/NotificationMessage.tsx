import React from "react";
import './NotificationMessage.sass'
import {capitalize} from "../../utils";

type Props = {
    children: React.ReactNode
    level?: 'info' | 'success' | 'error'
}

type State = {
    time: number
    paused: boolean
};

class NotificationMessage extends React.Component<Props, State> {
    timer: NodeJS.Timeout | undefined;

    state = {
        time: 5000, paused: false
    };

    onMouseOver = () => {
        this.setState({ paused: true });
    };

    onMouseOut = () => {
        this.setState({ paused: false });
    };

    onClick = () => {
        this.timer = setInterval(() => this.interval(400), 50);
        this.setState({ paused: false });
    };

    interval = (step=50) => {
        const { time, paused } = this.state;
        if(time <= 0 && this.timer) clearInterval(this.timer);
        if(!paused) this.setState({ time: time-step });
    };

    componentDidMount(): void {
        this.timer = setInterval(() => this.interval(), 50)
    };

    componentWillUnmount(): void {
        if(this.timer) clearTimeout(this.timer);
    }

    render() {
        const { time } = this.state;
        const { children, level } = this.props;
        if(time <= 0)
            return null;

        const styleClass = level ? `Notification--${capitalize(level)}` : '';

        return (
            <div
                className={`Notification ${styleClass}`}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                onClick={this.onClick}
            >
                {children}
                <div className="Progress" style={{ width: `${time / 5000 * 100}%` }}/>
            </div>
        );
    }
}

export default NotificationMessage;