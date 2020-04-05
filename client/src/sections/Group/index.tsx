import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Row, Col, Spin, Button } from 'antd'
import { useQuery } from '@apollo/react-hooks'
import { GROUP } from '../../lib/graphql/queries'
import { group as groupData, groupVariables } from '../../lib/graphql/queries/Group/__generated__/group'
import { displayErrorMessage } from '../../lib/utils'
import { GroupProfile, JoinGroup, GroupInfoAdmin } from './components'
import { Viewer } from '../../lib/types'

interface Props {
  viewer: Viewer
}
export const Group: React.FC<Props> = ({ viewer }) => {
  const { id } = useParams()
  const history = useHistory()
  const { data, error, loading } = useQuery<groupData & groupVariables>(GROUP, {
    variables: {
      id
    },
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  })

  const group = data && data.group ? data.group : null;
  let viewerIsCreator = false;
  if (group) {
    viewerIsCreator = group.creatorId === viewer.id;
  }
  let letGroupMember = false;
  if (group) {
    letGroupMember = group.groupMembers.findIndex(({ id }) => id === viewer.id) !== -1
  }
  const groupElement = group ? <GroupProfile group={group} /> : null;
  const askToLogin = !viewer.id && <Button type="primary" onClick={() => history.push('/login')}>Login</Button>
  const JoinElement = viewer.id && group && !letGroupMember && !viewerIsCreator ? <JoinGroup id={group.id} /> : null;
  const profileInfoAdminElement = group && viewerIsCreator ? <GroupInfoAdmin joinRequests={group.joinRequests} groupId={group.id} /> : null
  if (loading) {
    return <Spin size="large" />
  }
  if (error) {
    displayErrorMessage('try again later')
  }
  return (
    <div>
      <Row>
        <Col md={5} sm={1}></Col>
        <Col md={14} sm={22}>
          {groupElement}
          {JoinElement}
          {askToLogin}
          {profileInfoAdminElement}
        </Col>
        <Col md={5} sm={1}></Col>
      </Row>

    </div>
  )
}