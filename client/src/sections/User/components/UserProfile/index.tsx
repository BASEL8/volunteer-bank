import React from 'react'
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User'
import { Avatar, Typography, Divider, Tabs, List } from 'antd'
import { UserHelpRequests } from './components'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AskForHelpContent } from '../AskForHelp'
import { CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';

interface UserProfileTabProps {
  user: UserData["user"]
}
interface UserProfileContentProps {
  user: UserData["user"];
  viewerIsUser: boolean
  helpRequestsPage: number
  limit: number
  setHelpRequestsPage: (page: number) => void
  refetchUserData: () => void
}
const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs;

export const UserProfileTab: React.FC<UserProfileTabProps> = ({ user }) => {
  return user && user.avatar ? <Avatar size={30} src={user.avatar} /> : null
}
export const UserProfileContent: React.FC<UserProfileContentProps> = ({ user, viewerIsUser, helpRequestsPage, limit, setHelpRequestsPage, refetchUserData }) => {
  const { t, } = useTranslation()
  const helpRequests = user.helpRequests;
  const helpRequestsElements = helpRequests && helpRequests.result.length > 0 ? <UserHelpRequests helpRequests={helpRequests} helpRequestsPage={helpRequestsPage} limit={limit} setHelpRequestsPage={setHelpRequestsPage} /> : null;
  const groupMembersElement = user && user.memberAtt && user.memberAtt.map(({ id, avatar }) => <Link key={id} to={`/group/${id}`}><Avatar src={avatar ? avatar : ''} /></Link>)
  const AskForHelpElement = viewerIsUser && user && user.address ? <AskForHelpContent refetchUserData={refetchUserData} size={"small"} /> : null

  return (
    <div>
      <Title level={4}>{t("user.profile.details")}</Title>
      <Paragraph>
        {t("user.profile.name")} : <Text strong>{user.name}</Text> {user.verifiedAccount ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleOutlined twoToneColor="#eb2f96" />}
      </Paragraph>
      {viewerIsUser &&
        <>
          <Paragraph>
            {t("user.profile.contact")} : <Text strong>{user.contact}</Text>
          </Paragraph>
          {user.address && <Paragraph>
            {t("user.profile.address")} : <Text>{user.address}</Text>
          </Paragraph>}
        </>
      }
      {user.adminAtt && <Paragraph>
        admin : <Text><Link to={`/group/${user.adminAtt.id}`}>{user.adminAtt.name}</Link></Text>
      </Paragraph>}
      <Divider />{
        user && user.memberAtt && user.memberAtt.length > 0 ? <>
          <Title level={4}>Member Att</Title>
          {groupMembersElement}
          <Divider />
        </> : null
      }
      {viewerIsUser && <Tabs defaultActiveKey="1">
        <TabPane tab={t("user.profile.tabs.ask")} key="1">
          {AskForHelpElement}
        </TabPane>
        <TabPane tab={t("user.profile.tabs.tasks")} key="2">
          {user.memberAtt ? <List>
            <List.Item actions={[<div>{t("user.profile.tabs.tasks.accept")}</div>, <div>{t("user.profile.tabs.tasks.reject")}</div>]}>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<a href="https://ant.design">Help Offer</a>}
                description="Basel Munawwar want to help you with this task"
              />
              <div>content</div>
            </List.Item>
            <List.Item actions={[<div>{t("user.profile.tabs.tasks.accept")}</div>, <div>{t("user.profile.tabs.tasks.reject")}</div>]}>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<a href="https://ant.design">Help Offer</a>}
                description="Basel Munawwar want to help you with this task"
              />
              <div>content</div>
            </List.Item>
          </List> :
            'Join a group to start get tasks'
          }  </TabPane>
        <TabPane tab={t("user.profile.tabs.Requests")} key="3">
          {helpRequestsElements}
        </TabPane>
        <TabPane tab={t("user.profile.tabs.offers")} key="4">
          <List>
            <List.Item actions={[<div>{t("user.profile.tabs.tasks.accept")}</div>, <div>{t("user.profile.tabs.tasks.reject")}</div>]}>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<a href="https://ant.design">Help Offer</a>}
                description="Basel Munawwar want to help you with this task"
              />
              <div>content</div>
            </List.Item>
          </List>
        </TabPane>
      </Tabs>
      }
    </div >
  )
}