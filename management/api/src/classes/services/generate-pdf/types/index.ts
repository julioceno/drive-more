export interface ClassAdptad {
  instructorName: string;
  category: string;
  startAt: string;
  endAt: string;
}

export interface IBuildData {
  studentName: string;
  classes: ClassAdptad[];
  url: string;
  timeZone: string;
}
