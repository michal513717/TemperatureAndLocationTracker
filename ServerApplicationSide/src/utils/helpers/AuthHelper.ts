import jwt from 'jsonwebtoken';
import { TokenPayload } from '../../models/requests.models';
import { APPLICATION_CONFIG } from '../../configs';


export class AuthHelper {


  public static getDataFromToken(token: string) {
    try {
      const decoded = jwt.verify(token, APPLICATION_CONFIG.JWT_SECRET_KEY) as TokenPayload;
      return decoded;
    } catch (error) {
      console.log(error);
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }
  }
}