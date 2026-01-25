import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

class AuthMiddleware {

  public verifyToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers['authorization'];

    if (!token) {
      res.status(403).json({
        message: 'Missing token!'
      })

      return;
    }

    const jwtToken = token.split(' ')[1];

    jwt.verify(jwtToken, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'Token not valid'
        });
      }

      const payload = decoded as jwt.JwtPayload;
      res.locals.id = payload.userId;

      next();
    });
  }
}

export default AuthMiddleware;
