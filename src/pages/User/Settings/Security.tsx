import React from "react";
import Group from "../../../ui/Group/Group";
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";

type State = {
    oldEmail: string
    email1: string
    email2: string
    error: string
}

class Security extends React.Component<{}, State> {
    state: State = {
        oldEmail: '', email1: '', email2: '',
        error: ''
    }

    changeEmail = (e: React.FormEvent) => {
        e.preventDefault();
        const { oldEmail, email1, email2 } = this.state;
        let error = '';
        if(!oldEmail) error += 'Введите старый E-mail\n';
        if(!email1) error += 'Введите новый E-mail\n';
        if(!email2) error += 'Введите повтор нового E-mail\n';
        if(email1 !== email2) error += 'E-mail не совпадают\n';
        if(oldEmail === email1) error += 'Старый и новый E-mail не должны совпадать';

        if(error) {
            this.setState({ error });
            return;
        }
    }

    render() {
        const { oldEmail, email1, email2, error } = this.state;

        return (
            <Group title={'Смена E-mail'} className={'Settings_Group'}>
                {error && <pre className={'Error'}>{error}</pre>}
                <form onSubmit={this.changeEmail}>
                    <Input
                        placeholder={'Старый E-mail'}
                        type={'email'}
                        value={oldEmail}
                        onChange={e => this.setState({ oldEmail: e.target.value })}
                    />
                    <Input
                        placeholder={'Новый E-mail'}
                        type={'email'}
                        value={email1}
                        onChange={e => this.setState({ email1: e.target.value })}
                    />
                    <Input
                        placeholder={'Новый E-mail ещё раз'}
                        type={'email'}
                        value={email2}
                        onChange={e => this.setState({ email1: e.target.value })}
                    />
                    <Button>Сохранить</Button>
                </form>
            </Group>
        );
    }
}

export default Security;
