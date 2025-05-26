import { jwtDecode as jwtDecode_, JwtPayload } from "jwt-decode";

export type JwtDecodedType = {
  role: string;  
} & JwtPayload;

export default function jwtDecode(token: string) {
  return jwtDecode_<JwtDecodedType>(token)
}