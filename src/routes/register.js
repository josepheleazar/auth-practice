import { PUBLIC_ROUTE } from 'configs';
import Register from 'views/register';

export default {
  Component: Register,
  hasChildren: false,
  name: 'Register Route',
  path: 'register',
  type: PUBLIC_ROUTE,
}