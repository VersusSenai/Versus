export type TeamProps = {
  id: number;
  name: string;
  photo: string;
  description: string;
  registered_date: Date;
};

export type ResponseGetTeams = {
  0: TeamProps[];
  1: {
    currentPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
};
