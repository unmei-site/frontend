import React, { CSSProperties } from "react";
import Modal from "../../ui/Modal/Modal";
import Button from "../../ui/Button/Button";
import { useStore } from "react-redux";
import { hideModal } from "../../store/ducks/modal";

type Props = {
    onConfirm: () => void
    onDeny?: () => void
}

const ConfirmModal = ({ onConfirm, onDeny }: Props) => {
    const buttonStyle: CSSProperties = {
        width: '50%', boxSizing: "border-box",
        margin: 6, fontSize: '1.2rem'
    };

    const store = useStore<StoreState>();

    return (
        <Modal title={'Подтвердите действие'}>
            <div style={{ display: "flex" }}>
                <Button onClick={onConfirm} style={buttonStyle}>Да</Button>
                <Button onClick={() => {
                    if(onDeny)
                        onDeny();
                    store.dispatch(hideModal());

                }} style={buttonStyle}>Нет</Button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
