export interface TokenPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "USER";
  name: string;
  emailConfirmation: boolean;
  deviceVerification: boolean;
  profileId: string;
  profileComplete: boolean;
  avatarUrl: string;
  type: "access" | "refresh";
  iat: number;
  exp: number;
}
