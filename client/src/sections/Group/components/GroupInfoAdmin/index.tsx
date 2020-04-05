import React from 'react'
import { Tabs, Badge, List, Avatar } from 'antd'
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { group } from '../../../../lib/graphql/queries/Group/__generated__/group'
import { useMutation } from '@apollo/react-hooks'
import { VERIFY_REQUEST } from '../../../../lib/graphql/mutations'
import { verifyRequest as verifyRequestData, verifyRequestVariables } from '../../../../lib/graphql/mutations/VerifyRequest/__generated__/verifyRequest'
import { useTranslation } from 'react-i18next'
const { TabPane } = Tabs;
const { Item } = List;
interface Props {
  joinRequests: group['group']['joinRequests']
  groupId: string
}
export const GroupInfoAdmin: React.FC<Props> = ({ joinRequests, groupId }) => {
  const { t, } = useTranslation()
  const [verifyUser] = useMutation<verifyRequestData & verifyRequestVariables>(VERIFY_REQUEST, {
    onCompleted: data => console.log(data),
    onError: Error => console.log(Error)
  })
  const handleVerifyUser = (id: string) => {
    verifyUser({
      variables: {
        id,
        groupId
      }
    })
  }
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab={t('group.admin.tabs.tasks')} key="1">
          {t('group.admin.tabs.tasks')}
        </TabPane>
        <TabPane tab={<div>{t("group.admin.tabs.joinRequests")}<Badge count={joinRequests.length} overflowCount={99} /></div>} key="2">
          <List
            dataSource={joinRequests}
            renderItem={item => (
              <Item
                actions={[
                  <div onClick={() => item ? handleVerifyUser(item.id) : console.log('')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircleOutlined style={{ color: '#5fee5f', fontSize: 20, marginRight: 5 }} /> {t('group.admin.join.accept')}</div>,
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CloseCircleOutlined style={{ color: '#ff4d4e', fontSize: 20, marginRight: 5 }} /> {t('group.admin.join.reject')}</div>]}
              >
                <Item.Meta
                  avatar={<Avatar src={item && item.avatar ? item.avatar : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />}
                  title={<a href="https://ant.design">{item?.name}</a>}
                  description={<div>{item?.contact}</div>}
                />
              </Item>
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}