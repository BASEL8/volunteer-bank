import React from 'react'
import { Layout, Typography } from 'antd'
import logo from './assets/solidarity.png'
const { Header } = Layout
const { Title } = Typography;
export const AppHeaderSkeleton = () => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo" style={{ display: 'flex', alignContent: 'center', marginTop: 10 }}>
          <Title style={{ margin: 0 }}>V</Title>
          <img src={logo} alt="app -logo" />
          <Title style={{ margin: 0 }}>B</Title>
        </div>
      </div>
    </Header>
  )
}