import React, { useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom'
import { Card, Layout, Typography, Spin, Divider } from 'antd'
import { useMutation } from '@apollo/react-hooks'
import { LOG_IN } from '../../lib/graphql/mutations'
import { LogIn as LogInData, LogInVariables } from '../../lib/graphql/mutations/LogIn/__generated__/LogIn'
import { ErrorBanner } from '../../lib/components'
import { displaySuccessNotification } from '../../lib/utils'
import { useTranslation } from 'react-i18next'
import { Viewer } from '../../lib/types'
import styled from 'styled-components';
import { GoogleButton, FaceBookButton, LgoInForm } from './components'

interface Props {
  viewer: Viewer,
  setViewer: (viewer: Viewer) => void
}
const { Content } = Layout;
const { Text, Title } = Typography

export const Login: React.FC<Props> = ({ setViewer, viewer }) => {
  const { t, } = useTranslation()
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError }
  ] = useMutation<LogInData, LogInVariables>(
    LOG_IN,
    {
      onCompleted: (data) => {
        if (data && data.logIn) {
          setViewer(data.logIn);
          displaySuccessNotification(t("login.google.success.message"))
          if (data.logIn.token) {
            window.sessionStorage.setItem('token', data.logIn.token)
          } else {
            window.sessionStorage.removeItem('token')
          }
        }
      },
      onError: (error) => console.log(error)
    }
  )

  const logInRef = useRef(logIn)
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code')
    if (code) { logInRef.current({ variables: { input: { code } } }) }
  }, [])

  const loInErrorBannerElement = logInError ? <ErrorBanner description={t("login.google.error.banner")} /> : null;

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />
  }
  if (viewer && viewer.id) {
    const { id: viewerId } = viewer;
    return <Redirect to={`/user/${viewerId}`} />
  }
  if (logInLoading) {
    return <Content className="log-in"><Spin size="large" tip={t("login.google.loading.message")} /></Content>
  }
  return (
    <Content className="log-in">
      {loInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            {t("login.title")}
          </Title>
          <Text>{t("login.google.text")}</Text>
        </div>
        <ButtonsHolder>
          <GoogleButton />
          <FaceBookButton />
          <Divider />
          <LgoInForm setViewer={setViewer} />
        </ButtonsHolder>
        <Divider />
        <Text type="secondary">{t("login.google.helpText")}</Text>
      </Card>
    </Content>
  )
}
const ButtonsHolder = styled.div`
width:100%;
display:flex;
flex-direction:column;
align-items:stretch;
justify-content:center;
`