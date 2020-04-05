import React, { useState, ElementType } from 'react'
import styled from 'styled-components'
import { List } from 'antd'
import { MessageOutlined } from '@ant-design/icons';

import { HelpModal } from './components'
import { getCurrentMapData_getCurrentMapData_helpRequests_result as HelpRequestTypes, getCurrentMapData_getCurrentMapData_helpRequests as helpRequestsTypes } from '../../../../../../lib/graphql/queries/MapData/__generated__/getCurrentMapData'
import { Viewer } from '../../../../../../lib/types';

interface IconTextProps {
  icon: ElementType
  text: string
  onClick?: () => void
}
const IconText: React.FC<IconTextProps> = ({ icon, text, onClick }) => (
  <span onClick={onClick}>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

interface Props {
  helpRequests: helpRequestsTypes | null
  page: number
  limit: number
  setPage: (page: number) => void
  simplePagination: boolean
  viewer: Viewer
}
export const MapDataList: React.FC<Props> = ({ page, limit, setPage, helpRequests, simplePagination, viewer }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [modalData, setModalData] = useState<HelpRequestTypes | null>(null)
  const handleOpenModal = (data: HelpRequestTypes) => {
    setModalData(data)
    setVisible(true)
  }
  const result = helpRequests ? helpRequests.result : null
  const total = helpRequests ? helpRequests.total : 0
  const userHelpRequestsList = helpRequests ? (
    <List
      itemLayout="vertical"
      dataSource={result || undefined}
      locale={{
        emptyText: <div style={{ color: 'black', background: "white" }}>there is no help requests in this area with those filters</div>
      }}
      pagination={{
        size: 'small',
        position: "top",
        current: page,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        total: total || undefined,
        simple: simplePagination,
        onChange: (page: number) => setPage(page)
      }}
      renderItem={(helpRequest: any) => {
        return (
          <List.Item
            key={helpRequest.title}
            style={{ background: '#fff', margin: '5px 0px', padding: '3px 5px', minWidth: 200 }}
            onClick={() => viewer.adminAtt && handleOpenModal(helpRequest)}
          >
            <List.Item.Meta
              title={helpRequest.title}
              description={helpRequest.description}
            />
          </List.Item>
        )
      }}
    />
  ) : null
  const userBookingsElement = userHelpRequestsList ? (
    <div className="user-listings">
      {userHelpRequestsList}
    </div>
  ) : null;
  return (
    <Container>
      {userBookingsElement}
      <HelpModal visible={visible} setVisible={setVisible} modalData={modalData} />
    </Container>
  );

}
const Container = styled.div`
width:100%;
padding:20px;
`