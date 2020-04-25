import React from "react";
import './Modal.sass'

type Props = {
    onCloseRequest: any
    children: any
    className?: string
}

class Modal extends React.Component<Props> {
    private modal: HTMLDivElement | null | undefined;

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp, false);
        document.addEventListener('mousedown', this.handleOutsideClick, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp, false);
        document.removeEventListener('mousedown', this.handleOutsideClick, false);
    }

    handleKeyUp = (e: KeyboardEvent) => {
        if(e.code === 'Escape') {
            const { onCloseRequest } = this.props;
            e.preventDefault();
            onCloseRequest();
        }
    };

    handleOutsideClick = (e: any) => {
        if(this.modal && !this.modal.contains(e.target)) {
            const { onCloseRequest } = this.props;
            onCloseRequest();
        }
    };

    render() {
        const { onCloseRequest, children } = this.props;

        return (
            <div className="Modal__Overlay">
                <button type="button" className={"Modal__CloseButton"} onClick={onCloseRequest}>X</button>
                <div className={"Modal"} ref={node => (this.modal = node)}>
                    <div className={this.props.className}>{children}</div>
                </div>
            </div>
        );
    }
}

export default Modal;