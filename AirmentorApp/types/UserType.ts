export type Review = {
  grade: number;
  description: string;
  reviewer: UserType;
  reviewed: UserType;
};

export type UserType = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  place: string;
  password: string;
  profile_picture: string;
  grade: number;
  credits: number;
  description: string;
  languages: string[];
  googleId: string;
  role: string;
  reviews: Review[];
  registredAnnouncement: string[];
};
