import React from "react";
import './Modal.sass'
import {connect} from "react-redux";
import {setModal} from "../../store/actions";

type Props = {
    setModal: (modal: React.ReactNode | null) => void
    children: any
    className?: string
    title?: string
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
            const { setModal } = this.props;
            e.preventDefault();
            setModal(null);
        }
    };

    handleOutsideClick = (e: any) => {
        if(this.modal && !this.modal.contains(e.target)) {
            const { setModal } = this.props;
            setModal(null);
        }
    };

    render() {
        const { setModal, children, title } = this.props;

        return (
            <div className="Modal__Overlay">
                <div className={"Modal"} ref={node => (this.modal = node)}>
                    <div className={this.props.className}>
                        <div className="Modal__Header">
                            {title && title}
                            <button className={"Modal__CloseButton"} onClick={() => setModal(null)}>X</button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null,
    dispatch => ({
        setModal: (modal: React.ReactNode | null) => {
            dispatch(setModal(modal))
        }
    })
)(Modal);