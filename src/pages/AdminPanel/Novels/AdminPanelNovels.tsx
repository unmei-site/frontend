import React from "react";
import {connect} from "react-redux";

type Props = {

};

type State = {

};

class AdminPanelNovels extends React.Component<Props, State> {
    render() {
        return (
            <div>Novels</div>
        )
    }
}

export default connect(
    (state: StoreState) => ({
        user: state.currentUser
    })
)(AdminPanelNovels);