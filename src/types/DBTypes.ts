type User = {
  user_id: number;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
};

type Cat = {
  cat_id: number;
  cat_name: string;
  weight: number;
  filename: string;
  birthdate: Date;
  lat: number;
  lng: number;
  owner: User | number;
};

export {Cat};

export {User};
