import Dashboard from 'views/dashboard';
import { PRIVATE_ROUTE } from 'configs';

export default {
  Component: Dashboard,
  hasChildren: false,
  name: 'Dashboard Route',
  path: 'dashboard',
  type: PRIVATE_ROUTE,
}