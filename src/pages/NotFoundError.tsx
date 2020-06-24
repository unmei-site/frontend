import React from "react";

function NotFoundError() {
    return (
        <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem'}}>Увы, данная страница не найдена!</div>
            <div>Проверьте правильность написания ссылки!</div>
        </div>
    )
}

export default NotFoundError;