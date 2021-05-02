import React from "react";
// @ts-ignore
// import Recaptcha from "react-recaptcha";
import Recaptcha from '../../ui/Recaptcha/Recaptcha';
import './PasswordRestore.sass';
import { generateRestoreLink } from "../../api/users";
import Button from "../../ui/Button/Button";

type State = {
    email: string
    recaptcha: string
}

class PasswordRestoreGenerate extends React.Component<{}, State> {
    state: State = {
        email: '', recaptcha: ''
    }
    private recaptcha: any;

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
                <Button>Восстановить</Button>
            </form>
        );
    }
}

export default PasswordRestoreGenerate;
