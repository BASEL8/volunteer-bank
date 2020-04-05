import React, { useState } from 'react'
import { Viewer } from '../../lib/types'
import { useQuery } from '@apollo/react-hooks'
import { USER } from '../../lib/graphql/queries'
import { User as UserData, UserVariables } from '../../lib/graphql/queries/User/__generated__/User'
import { useParams } from 'react-router-dom'
import { useScrollToTop } from '../../lib/hooks'
import { PageSkeleton, ErrorBanner } from '../../lib/components'
import { UserProfileContent, AskForHelpContent, GeoLocationButton, CreateGroupe } from './components'
import { Layout, Row, Col, Typography } from 'antd'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}
const { Content } = Layout
const { Paragraph } = Typography;
const PAGE_LIMIT = 4;
export const User: React.FC<Props> = ({ viewer, setViewer }) => {
  const { t, } = useTranslation()
  const { id } = useParams()
  const [helpRequestsPage, setHelpRequestsPage] = useState(1)
  const { data, error, loading, refetch } = useQuery<UserData & UserVariables>(USER, {
    variables: {
      id,
      helpRequestsPage,
      limit: PAGE_LIMIT
    },
    onError: (error) => console.log(error)
  })
  useScrollToTop()
  const refetchUserData = () => refetch()
  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    )
  }
  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description={t("")} />
        <PageSkeleton />
      </Content>)
  }
  const viewerIsUser = viewer.id === id;
  const user = data ? data.user : null;
  const NotVerifyAccount = viewerIsUser && !user?.verifiedAccount ? <Paragraph> {t("user.profile.auth")}</Paragraph> : null;

  const userProfileContentElement = user ? <UserProfileContent user={user} viewerIsUser={viewerIsUser} helpRequestsPage={helpRequestsPage} limit={PAGE_LIMIT} setHelpRequestsPage={setHelpRequestsPage} refetchUserData={refetchUserData} /> : null
  const geoLocationButtonElement = viewerIsUser && user && !user.address ? <GeoLocationButton refetchUserData={refetchUserData} /> : null
  const CreateGroupeElement = viewerIsUser && user && user.address && user.verifiedAccount && !user.adminAtt ? <CreateGroupe refetchUserData={refetchUserData} /> : null;
  console.log(user)
  return (
    <Container>
      <Row>
        <Col md={5} sm={1}></Col>
        <Col md={14} sm={22}>
          {userProfileContentElement}
          {CreateGroupeElement}
          {NotVerifyAccount}
          {geoLocationButtonElement}
        </Col>
        <Col md={5} sm={1}></Col>
      </Row>
    </Container >
  )
}
const Container = styled(Content)`
width:100%;
height:100%;
flex:1;
padding:25px;
display:flex;
flex-direction:column
`
