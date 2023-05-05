import UserAdd from './UserAdd'
import UserEdit from './UserEdit'
import UserRoles from './UserRoles'
import UserRolesAdd from './UserRolesAdd'
import UserRolesEdit from './UserRolesEdit'
import ChangePassword from './ChangePassword'
import Users from './Users'
export const userRoutes = [
  {
    path: '/booking/user/add',
    exact: true,
    name: 'Add user',
    element: UserAdd,
  },
  {
    path: '/booking/user/edit',
    exact: true,
    name: 'Edit user',
    element: UserEdit,
  },
  {
    path: '/booking/user/roles',
    exact: true,
    name: 'Edit user',
    element: UserRoles,
  },
  {
    path: '/booking/user/roles/add',
    exact: true,
    name: 'Add user Role',
    element: UserRolesAdd,
  },
  {
    path: '/booking/user/roles/edit',
    exact: true,
    name: 'Edit user Role',
    element: UserRolesEdit,
  },
  {
    path: '/password',
    exact: true,
    name: 'Change Password',
    element: ChangePassword,
  },
  { path: '/booking/users', exact: true, name: 'User', element: Users },
]
