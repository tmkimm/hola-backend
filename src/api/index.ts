import { Router } from 'express';
import post from './routes/post';
import auth from './routes/auth';
import login from './routes/login';
import logout from './routes/logout';
import user from './routes/user';
import feedback from './routes/feedback';
import commment from './routes/comment';
import reply from './routes/reply';

export default () => {
  const app = Router();
  auth(app);
  login(app);
  logout(app);
  user(app);
  post(app);
  feedback(app);
  commment(app);
  reply(app);
  return app;
};
