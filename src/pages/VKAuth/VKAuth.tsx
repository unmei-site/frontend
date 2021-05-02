import React from "react";
import Title from "../../ui/Title/Title";
import { registerUserVk } from "../../api/auth";

class VKAuth extends React.Component {
    componentDidMount() {
        console.log()
        registerUserVk(window.location.href.split('?')[1])
    }

    render() {
        return (
            <Title>{window.location.href}</Title>
        );
    }
}

export default VKAuth;
