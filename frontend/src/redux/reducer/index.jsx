import { combineReducers } from 'redux';
import selectedMonthReducer from './monthSelector';
import currentProjectIdReducer from './currentProjectId';
import oauthReducer from './oauthReducer';

const rootReducer = combineReducers({
  selectedMonth: selectedMonthReducer,
  currentProjectId: currentProjectIdReducer,
  oauth: oauthReducer,
});

export default rootReducer;
