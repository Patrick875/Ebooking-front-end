//jshint esversion:9

import { combineReducers } from 'redux'
import UIReducer from './UI/ui-reducer'
import authReducer from './Auth/authReducer'
import rolesReducer from './Roles/RolesReducer'
import userReducer from './User/userReducer'
import itemReducer from './StockItem/ItemReducer'
import categoryReducer from './Categories/categroiesReducer'
import selectionReducer from './Select/selectionReducer'
import formReducer from './MultiStepForm/formReducer'
import constantsReducer from './Constants/constantsReducer'

export default combineReducers({
  sidebarShow: UIReducer,
  auth: authReducer,
  roles: rolesReducer,
  systemUsers: userReducer,
  stockItems: itemReducer,
  categories: categoryReducer,
  selection: selectionReducer,
  constants: constantsReducer,
  multiStepForm: formReducer,
})
