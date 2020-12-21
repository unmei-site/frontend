import React from "react";
import { getClub } from "../../api/clubs";
import Loading from "../../ui/Loading";
import Group from "../../ui/Group/Group";

type Props = {
    match: { params: { clubId: number } }
};

type State = {
    club: ClubType | null
}

class Club extends React.Component<Props, State> {
    state: State = {
        club: null
    }

    componentDidMount() {
        getClub(this.props.match.params.clubId).then(club => {
            this.setState({ club });
        });
    }

    render() {
        if(!this.state.club) return <Loading/>;
        return (
            <div>
                <Group title={this.state.club.name}>

                </Group>
            </div>
        )
    }
}

export default Club;
