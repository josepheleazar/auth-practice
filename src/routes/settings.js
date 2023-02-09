import Settings from 'views/settings';
import { PRIVATE_ROUTE } from 'configs';

export default {
  Component: Settings,
  hasChildren: false,
  name: 'Settings Route',
  path: 'settings',
  type: PRIVATE_ROUTE,
}