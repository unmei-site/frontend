import React from "react";

type Props = {
    sitekey: string
    theme?: 'dark' | 'light'
    onVerify?: (res: string) => void
    onError?: (error: string) => void
    onExpired?: () => void
}

type State = {
    isReady: boolean
}

class Recaptcha extends React.Component<Props, State> {
    state: State = {
        isReady: false
    }
    private readonly interval: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);

        this.interval = setInterval(() => {
            // @ts-ignore
            if(typeof window?.grecaptcha?.render === 'function') {
                clearInterval(this.interval);
                this.setState({ isReady: true })
            }
        }, 100)
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        const { isReady: isReadyPrev } = prevState;
        const { isReady } = this.state;

        if(!isReadyPrev && isReady) {
            const { sitekey, theme, onExpired, onVerify } = this.props;
            // @ts-ignore
            window.grecaptcha.render(document.getElementById('g-recaptcha'), {
                sitekey, theme,
                callback: onVerify || undefined,
                'expired-callback': onExpired || undefined
            })
        }
    }

    reset = () => {
        // @ts-ignore
        if(typeof window?.grecaptcha?.reset === "function") window.grecaptcha.reset(document.getElementById('g-recaptcha'));
    }

    render() {
        return (
            <div
                id="g-recaptcha"
            />
        )
    }
}

export default Recaptcha;
