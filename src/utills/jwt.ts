import JWT, { JwtPayload } from 'jsonwebtoken';
import { isString } from './isStringEmpty';
import config from '../config/index';

type jwtPayload = {
  nickName?: string;
  idToken?: string;
  _id?: string;
};
export function signJWT(payload: jwtPayload, expiresIn: string): Promise<JWT.Secret> {
  return new Promise((resolve, reject) => {
    JWT.sign(
      payload,
      config.jwtSecretKey,
      {
        expiresIn,
        issuer: config.issuer,
      },
      (err, token) => {
        if (err || !isString(token)) reject(err);
        resolve(token as string);
      },
    );
  });
}

export function verifyJWT(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    JWT.verify(token, config.jwtSecretKey, (err, decoded: any) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}

export function isValidAccessToken(decoded: string | JwtPayload): boolean {
  return !!(typeof decoded !== 'string' && (('idToken' in decoded) as any));
}
