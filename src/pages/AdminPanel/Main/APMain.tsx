import React from "react";
import Group from "../../../ui/Group/Group";
import { build, getVersion, version } from "../../../api/api";
import Loading from "../../../components/Loading";

type State = {
    backend: VersionResponse | null
}

class APMain extends React.Component<any, State> {
    state: State = {
        backend: null
    }

    componentDidMount() {
        getVersion().then(backend => this.setState({ backend }));
    }

    render() {
        const { backend } = this.state;

        if(!backend) return <Loading/>;
        return (
            <Group title={'Основное'}>
                <div>
                    Текущая версия сайта: <span style={{ color: backend.build == build ? "green" : "red" }}>{version} (билд: {build})</span>
                </div>
                <div>
                    Текущая версия API: <span style={{ color: backend.build == build ? "green" : "red" }}>{backend.version} (билд: {backend.build})</span>
                </div>
                <div>
                    Совпадение версий сборок: <span style={{ color: backend.build == build ? "green" : "red" }}>{backend.build == build ? 'да' : 'нет'}</span>
                </div>
            </Group>
        );
    }
}

export default APMain;
