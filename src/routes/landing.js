import Landing from 'views/landing';
import { GENERAL_ROUTE } from 'configs';

export default {
  Component: Landing,
  hasChildren: false,
  name: 'Landing Route',
  path: '/',
  type: GENERAL_ROUTE,
}