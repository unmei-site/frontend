import './Novels.sass'
import React, { Suspense } from "react";
import { fetchNovels, searchNovel } from "../../api/novels";
import { fetchGenres } from "../../api/genres";
import Loading from "../../components/Loading";
import { connect } from "react-redux";
import { setPreloader } from "../../store/ducks/preloader";
import { Helmet } from "react-helmet";
import { Input } from "../../ui/ui";
const NovelItem = React.lazy(() => import('../../ui/NovelItem/NovelItem'))

type Props = {
    setPreloader: SetPreloaderStatus
}

type State = {
    novels: Unmei.NovelType[] | null
    lastSearch: number
    allGenres: Unmei.GenreType[]
    years: number[]
    genres: string[]
}

class Novels extends React.Component<Props, State> {
    state: State = {
        novels: null, lastSearch: 0,
        allGenres: [],
        genres: [], years: []
    };

    componentDidMount = () => {
        const { setPreloader } = this.props;

        setPreloader(true);
        fetchNovels('rating').then(async novels => {
            novels.forEach(novel => {
                novel.release_date = new Date(novel.release_date);
            });

            const allGenres = await fetchGenres();

            this.setState({ novels, allGenres });
            setPreloader(false);
        });
    };

    switchFilter(filter: string, key: any) {
        // @ts-ignore
        let filters: string[] = this.state[filter];

        filters = filters as string[];
        if(filters.includes(key)) {
            this.setState({ [filter]: [...filters.filter(x => x !== key)] } as Pick<State, any>)
        } else {
            this.setState({ [filter]: [...filters, key] } as Pick<State, any>)
        }
    };

    searchNovels = (q: string) => {
        if(q.length === 0) {
            fetchNovels('rating').then(async novels => {
                novels.forEach(novel => {
                    novel.release_date = new Date(novel.release_date);
                });

                const allGenres = await fetchGenres();
                this.setState({ novels, allGenres });
            });
        } else {
            searchNovel(q).then(novels => {
                novels.forEach(novel => {
                    novel.release_date = new Date(novel.release_date);
                });
                this.setState({ novels });
            });
        }
    }

    render() {
        let { novels } = this.state;
        const { years, genres, allGenres } = this.state;
        if(!novels) return <Loading/>;

        novels = novels
            .filter(novel => {
                if(years.length === 0) return novel;
                return years.includes(novel.release_date.getFullYear())
            })
            .filter(novel => {
                if(genres.length === 0) return novel;
                if(novel.genres.filter(genre => genres.includes(genre.name)).length > 0) return novel;
                return null;
            });

        return (
            <div className={'Novels'}>
                <Helmet>
                    <title>Новеллы</title>
                    <meta name='description' content=''/>
                </Helmet>
                <div className="Novels__List">
                    <Input placeholder={'Поиск...'} className={'Novels__Search'} onChange={e => this.searchNovels(e.target.value)}/>
                    <div className="Novels__List_Items">
                        <Suspense fallback={<Loading/>}>
                            {novels.length === 0 && (
                                <div style={{ textAlign: 'center', width: '100%' }}>По данным фильтрам ничего не найдено...</div>
                            )}
                            {novels.map(novel => <NovelItem {...novel} key={novel.id} viewType={'grid'}/>)}
                        </Suspense>
                    </div>
                </div>
                <div className="Novels__Filters">
                    <div className="Novels__Filters_Genre">
                        <div className="Novels__Filters_Title">Жанры</div>
                        {allGenres.map(genre => (
                            <label key={genre.id}>
                                <input type="checkbox" onChange={() => this.switchFilter('genres', genre.name)}/>
                                {genre.localized_name}
                            </label>
                        ))}
                    </div>

                    <div className="Novels__Filters_Year">
                        <div className="Novels__Filters_Title">Год выпуска</div>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2021)}/>2021</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2020)}/>2020</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2019)}/>2019</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2018)}/>2018</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2017)}/>2017</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2016)}/>2016</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2015)}/>2015</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2014)}/>2014</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2013)}/>2013</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2012)}/>2012</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2011)}/>2011</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2010)}/>2010</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2009)}/>2009</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2008)}/>2008</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2007)}/>2007</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2006)}/>2006</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2005)}/>2005</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2004)}/>2004</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2003)}/>2003</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2002)}/>2002</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2001)}/>2001</label>
                        <label><input type="checkbox" onClick={() => this.switchFilter('years', 2000)}/>2000</label>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    null,
    dispatch => ({
        setPreloader: (s: boolean) => dispatch(setPreloader(s))
    })
)(Novels);
