import React from "react";
import News from "./News";
import './Main.sass';

class Main extends React.Component {
    render() {
        return (
            <div className={'Main'}>
                <News/>
            </div>
        );
    }
}

export default Main;