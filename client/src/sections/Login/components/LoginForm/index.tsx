import React, { useState } from 'react'
import { Tabs } from 'antd';
import { Login, Signup } from './components'
import { Viewer } from '../../../../lib/types';
interface Props {
  setViewer: (viewer: Viewer) => void
}
const { TabPane } = Tabs;
export const LgoInForm: React.FC<Props> = ({ setViewer }) => {
  const [activeTab, setActiveTab] = useState("1")
  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab} >
      <TabPane tab="Login" key="1">
        <Login setViewer={setViewer} />
      </TabPane>
      <TabPane tab="Signup" key="2">
        <Signup setActiveTab={setActiveTab} />
      </TabPane>
    </Tabs>
  )
}