/**
 * @format
 */

import {AppRegistry} from 'react-native';
import StackNavigator from './src/routes';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => StackNavigator);
