import { get } from "./api";

export const fetchGenres = () => get<Unmei.GenreType[]>('genres');
