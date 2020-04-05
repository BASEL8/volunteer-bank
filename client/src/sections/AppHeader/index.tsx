import React from 'react'
import { Layout, Affix, Typography } from 'antd'
import { MenuItems, ChangeLanguage } from './components'
import { Link } from 'react-router-dom'
import logo from './assets/solidarity.png'
import { Viewer } from '../../lib/types'

interface Props {
  viewer: Viewer,
  setViewer: (viewer: Viewer) => void
}
const { Header } = Layout;
const { Title } = Typography;
export const AppHeader: React.FC<Props> = ({ viewer, setViewer }) => {
  return (
    <Affix offsetTop={0}>
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo" style={{ flex: 1 }}>
            <Link to="/" style={{ display: 'flex', alignContent: 'center', marginTop: 10 }}>
              <Title style={{ margin: 0 }}>V</Title>
              <img src={logo} alt="app -logo" />
              <Title style={{ margin: 0 }}>B</Title>
            </Link>
          </div>
          <ChangeLanguage />
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
        <div className="app-header__menu-section">
        </div>
      </Header>
    </Affix>
  )
}