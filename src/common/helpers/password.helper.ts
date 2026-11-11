import { hash, verify } from "argon2";

// make a safe hash of the password
export const hashPassword = async (password: string) => {
  return await hash(password);
};

// check a plain password against the saved hash
export const verifyPassword = async (hashed: string, password: string) => {
  return await verify(hashed, password);
};