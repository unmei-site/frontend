import React from "react";
import { getClubs } from "../../api/clubs";
import { Link } from "react-router-dom";

type Props = {}
type State = {
    clubs: Unmei.ClubType[]
}

class Clubs extends React.Component<Props, State> {
    state: State = {
        clubs: []
    }

    componentDidMount() {
        getClubs().then(clubs => {
            this.setState({ clubs });
        });
    }

    render() {
        const { clubs } = this.state;

        return (
            <div>
                {clubs.map(club => (
                    <Link to={`/clubs/${club.id}`} key={club.id}>
                        <div>
                            <img src={club.avatar} width={96} height={96} style={{ borderRadius: '50%' }} alt=""/>
                            <h2>{club.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }
}

export default Clubs;
