import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button, Menu, Avatar } from 'antd'
import { UserAddOutlined, LoginOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { Viewer } from '../../../../lib/types'
import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut'
import { displaySuccessNotification, displayErrorMessage } from '../../../../lib/utils'
import styled from 'styled-components'
const { Item, SubMenu } = Menu;
interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void

}
export const MenuItems: React.FC<Props> = ({ viewer, setViewer }) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut)
        window.sessionStorage.removeItem('token')
        displaySuccessNotification('you have successfully logged out')
      }
    },
    onError: (data) => {
      displayErrorMessage("sorry we weren't able to log you out. please try agin later")
    }
  })
  const handleLogOut = () => {
    logOut()
  }
  const subMenuLogin = viewer.id && viewer.avatar ? (
    <SubMenu title={<Avatar src={viewer.avatar} />}>
      <Item key="/user">
        <Link to={`/user/${viewer.id}`}>
          <UserAddOutlined />
          Profile
        </Link>
      </Item>
      <Item key="logout">
        <div onClick={handleLogOut}>
          <LoginOutlined />
          Log out
        </div>
      </Item>
    </SubMenu>
  ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">
            Sign In
        </Button>
        </Link>
      </Item>
    )
  return (
    <CustomMenu mode="horizontal" selectable={false} >
      {subMenuLogin}
    </CustomMenu>
  )
}
const CustomMenu = styled(Menu)`
padding : 0 5px;
`