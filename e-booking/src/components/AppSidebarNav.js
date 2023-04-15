import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'
import { useSelector } from 'react-redux'

export const AppSidebarNav = ({ items }) => {
  /*Get role accessTabs, authentication state, and permissions from the redux store  */

  let isAuth = useSelector((state) => state.auth.isAuth)
  let role = useSelector((state) => state.auth.user.Role) || ''

  /*filter through items check if item name is included in access of the role
  if yes show the item in the nav else remove it from the nav*/

  items =
    isAuth && items && role.name !== 'admin'
      ? items.filter((item) =>
          Object.keys(role.access).includes(item.name.toLowerCase())
            ? item
            : '',
        )
      : items

  /*filter through items check for items with sub-items*/
  /*for items with sub-items filter through the sub-items*/
  /*if the sub item starts with Add and add is not included in permissions remove the sub-item else keep the sub-item*/
  /*if the sub item starts with All and view is not included in permissions remove the sub-item else keep the sub-item*/

  items = items.map((item) => {
    if (
      isAuth &&
      role.name !== 'admin' &&
      item.items &&
      item.items.length !== 0
    ) {
      let subs = item.items
      let head = item.name.toLowerCase()
      console.log(head)
      subs = subs.filter((sub) => {
        if (role.access && role.access[head].includes(sub.name)) {
          return sub
        }
        return ''
      })
      item.items = subs
    }

    return item
  })

  const location = useLocation()
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
