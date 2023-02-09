import Login from 'views/login';
import { PUBLIC_ROUTE } from 'configs';

export default {
  Component: Login,
  hasChildren: false,
  name: 'Login Route',
  path: 'login',
  type: PUBLIC_ROUTE,
}