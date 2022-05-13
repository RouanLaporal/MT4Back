
export interface IFilm {
  filmId: number;
  title: string;
  duration: number;
  rentalRate: number;
}

export type IFilmCreate = Omit<IFilm, 'filmId'>;
export type IFilmUpdate = Partial<IFilmCreate>;
export type IFilmRO = Readonly<IUser>;