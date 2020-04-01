 import './Novels.sass'
import React from "react";
import {fetchNovels} from "../../api/novels";
import NovelItem from '../NovelItem/NovelItem';
 import Loading from "../Loading";

type State = {
    novels: NovelType[] | null
    years: string[]
    genres: string[]
}

class Novels extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            novels: null,
            genres: [], years: []
        };

        document.title = 'Новелы';
    }

    componentDidMount = () => {
        fetchNovels('rating').then((novels: NovelType[]) => {
            novels?.forEach(novel => {
                novel.release_date = new Date(novel.release_date);
            });
            this.setState({ novels });
        })
    };

    switchFilter(filter: string, key: any) {
        // @ts-ignore
        const filters: string[] = this.state[filter];
        if(filters.includes(key)) {
            // @ts-ignore
            this.setState({ [filter]: [...filters.filter(x => x !== key)] })
        } else {
            // @ts-ignore
            this.setState({ [filter]: [...filters, key] })
        }
    };

    render() {
        const { novels } = this.state;
        if(!novels)
            return <Loading/>;
        /*const filteredNovels = novels.filter(novel => {
            if(years.includes(novel.release_date.getFullYear().toString())) {
                return true;
            }
            return false;
        });*/

        return (
            <div className={'Novels'}>
                <div className="Novels__List">
                    {novels.map((novel: NovelType) => <NovelItem {...novel} key={novel.id} />)}
                </div>
                {/*<div className="Novels__Filters">
                    <div className="Novels__Filters_Genre">
                        <div className="Novels__Filters_Title">Жанры</div>
                        <label><input type="checkbox"/>Романтика</label>
                        <label><input type="checkbox"/>Детектив</label>
                    </div>

                    <div className="Novels__Filters_Year">
                        <div className="Novels__Filters_Title">Год выпуска</div>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', '2020')}/>2020</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', '2019')}/>2019</label>
                    </div>
                </div>*/}
            </div>
        );
    }
}

export default Novels;