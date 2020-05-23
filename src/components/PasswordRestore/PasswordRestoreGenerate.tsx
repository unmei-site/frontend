import React from "react";
// @ts-ignore
// import Recaptcha from "react-recaptcha";
import Recaptcha from '../Recaptcha/Recaptcha';
import './PasswordRestore.sass';
import {generateRestoreLink} from "../../api/users";

type State = {
    email: string
    recaptcha: string
}

class PasswordRestoreGenerate extends React.Component<{}, State> {
    private recaptcha: any;

    state: State = {
        email: '', recaptcha: ''
    }

    onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const { email, recaptcha } = this.state;
        generateRestoreLink(email, recaptcha).then(console.log)
    }

    componentWillUnmount() {
        this.recaptcha.reset()
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} className={'PasswordRestore'}>
                <input
                    type="email"
                    onChange={event => this.setState({ email: event.target.value })}
                    placeholder={'E-mail'}
                />

                <Recaptcha
                    ref={(e: any) => this.recaptcha = e}
                    onVerify={(res: string) => this.setState({ recaptcha: res })}
                    theme={'dark'}
                    sitekey={'6LfnDsMUAAAAAEDfD5ubCdFQbNUnKxxJlMWeUMzN'}
                />
                <button>Восстановить</button>
            </form>
        );
    }
}

export default PasswordRestoreGenerate;