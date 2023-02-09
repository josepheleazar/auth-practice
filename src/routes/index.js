import dashboard from './dashboard';
import landing from "./landing";
import login from './login';
import register from "./register";
import settings from './settings';

const routes = [
  {
    ...dashboard
  },
  {
    ...landing
  },
  {
    ...login
  },
  {
    ...register
  },
  {
    ...settings
  },
]

export default routes;