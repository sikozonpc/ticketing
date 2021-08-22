import { BadRequestError, currentUser, UnauthorizedError, validateRequest } from '@tfticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { PasswordService } from '../services/password';

const JWT_KEY = process.env.JWT_KEY ?? '';

export const authRouter = express.Router();

authRouter.get('/currentuser',
  currentUser,
  async (req: Request, res: Response) => {
    res.status(200).send({ currentUser: req.currentUser || null });
  });

authRouter.post('/register', [
  body('email')
    .isEmail(),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 }),
],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('that email is unavalaible');
    }

    const freshUser = User.build({ email, password });
    await freshUser.save();

    const userJWT = jwt.sign({ id: freshUser.id, email: freshUser.email }, JWT_KEY);
    
    req.session = { jwt: userJWT };
    res.status(201).send(freshUser);
  });

authRouter.post('/login',
  [
    body('email')
      .isEmail(),
    body('password')
      .trim()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError();
    }

    const passwordsMatch = await PasswordService.compare(user.password, password);
    if (!passwordsMatch) {
      throw new UnauthorizedError();
    }

    const userJWT = jwt.sign({ id: user.id, email: user.email }, JWT_KEY);

    req.session = { jwt: userJWT };
    res.status(200).send('success');
  });

authRouter.post('/logout', (req, res) => {
  req.session = null;

  res.send({});
});
