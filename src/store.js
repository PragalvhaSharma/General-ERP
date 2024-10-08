import { createStore, combineReducers } from 'redux';
// ... existing reducers ...
// Remove ERP and Investor Profile reducers
// import erpReducer from './reducers/erpReducer';
// import investorProfileReducer from './reducers/investorProfileReducer';

const rootReducer = combineReducers({
  // ... existing reducers ...
  // Remove the following lines
  // erp: erpReducer,
  // investorProfile: investorProfileReducer,
});

const store = createStore(rootReducer);

export default store;