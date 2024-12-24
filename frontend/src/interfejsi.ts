export interface ApplicationUser {
  username: string;
  email: string;
  role: string;
}

export interface ApplicationUserToken {
    username: string;
    email: string;
    token: string;
    role: string;
  }