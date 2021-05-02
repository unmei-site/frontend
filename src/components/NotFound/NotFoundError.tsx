import React from "react";

function NotFoundError() {
    return (
        <div style={{ textAlign: 'center', width: '100%', height: '100%' }}>
            <div style={{ fontSize: '2rem', fontWeight: 600 }}>Увы, данная страница не найдена!</div>
            <div>Проверьте правильность написания ссылки!</div>
            <img src="/static/img/not-found.png" style={{ width: 300, height: 400 }} alt=""/>
        </div>
    );
}

export default NotFoundError;
