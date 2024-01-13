import type { Request } from "express";
import type { AccountType } from "./database.models";

export type AuthRequest<
  P = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  user?: TokenPayload;
};

export type TokenPayload = {
  userName: string;
  accountType: AccountType;
};