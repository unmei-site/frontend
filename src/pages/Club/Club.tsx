import React from "react";
import { getClub } from "../../api/clubs";
import Loading from "../../components/Loading";
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
        const { match } = this.props;

        getClub(match.params.clubId).then(club => {
            this.setState({ club });
        });
    }

    render() {
        const { club } = this.state;
        if(!club) return <Loading/>;

        return (
            <Group title={club.name}>
                <img src={club.avatar} width={96} height={96} style={{ borderRadius: '50%' }} alt=""/>
            </Group>
        );
    }
}

export default Club;
