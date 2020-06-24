import React from "react";
import Button from "../Button/Button";
import './ConfirmPopout.sass'
import '../Modal/Modal.sass';
import {connect} from "react-redux";
import {hideModal} from "../../store/actions";

type Props = {
    hideModal: () => void
    onConfirm?: () => void
    onDismiss?: () => void
    title?: string
    children: any
}

class ConfirmPopout extends React.Component<Props> {
    onConfirm = () => {
        const { hideModal, onConfirm } = this.props;
        if(onConfirm) onConfirm();
        hideModal();
    }

    onDismiss = () => {
        const { hideModal, onDismiss } = this.props;
        if(onDismiss) onDismiss();
        hideModal();
    }

    render() {
        const { children, title } = this.props;

        return (
            <div className="Modal__Overlay">
                <div className={"Modal"}>
                    {title && <div className="Modal__Header">
                        {title}
                    </div>}
                    {children}
                    <div className={'Buttons'}>
                        <Button onClick={this.onConfirm}>Да</Button>
                        <Button onClick={this.onDismiss}>Нет</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null,
    dispatch => ({
        hideModal: () => dispatch(hideModal())
    })
)(ConfirmPopout);