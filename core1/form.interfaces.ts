export interface LoginForm {
    username: string;
    password: string;
}

export interface RegisterForm {
    email: string;
    name: string;
    surname?: string;
    password: string;
}

export interface CreateUserResponse  {
    statusCode: number;
    success: string;
    payload?: {
      message: string;
    };
  };
  export interface ZoneForm {
    name: string;
    
}
 
