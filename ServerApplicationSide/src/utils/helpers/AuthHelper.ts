import jwt from 'jsonwebtoken';
import { TokenPayload } from '../../models/requests.models';
import { APPLICATION_CONFIG } from '../../configs';
import { InvalidTokenError, TokenExpiredError } from '../errors/errors';
import { Logger, getLogger } from 'log4js';

const logger = getLogger("Auth Helper");

export class AuthHelper {


  public static getDataFromToken(token: string) {
    try {
      const decoded = jwt.verify(token, APPLICATION_CONFIG.JWT_SECRET_KEY) as TokenPayload;
      return decoded;
    } catch (error) {
      logger.warn("Token Expired or ivalid Token");
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }
  }

  public static generateToken({ userName, accountType }: TokenPayload) {

    const payload = { userName, accountType };

    const token = jwt.sign(payload, APPLICATION_CONFIG.JWT_SECRET_KEY, { expiresIn: "1d" });

    return { token };
  }
}