import React from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import { AUTH_URL } from '../../../../lib/graphql/queries/AuthUrl'
import { AuthUrl as AuthUrlData } from '../../../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import googleLogo from '../../assets/google.png'
import { displayErrorMessage } from '../../../../lib/utils'
export const GoogleButton: React.FC<{}> = () => {
  const { t, } = useTranslation()
  const client = useApolloClient()

  const handleGoogleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL
      })
      window.location.href = data.authUrl;
    } catch (error) {
      displayErrorMessage(t("login.google.error.message"))
    }
  }
  return (
    <Button className="log-in-card__login-button log-in-card__login-button-google " onClick={handleGoogleAuthorize}>
      <img src={googleLogo} className="log-in-card__google-button-logo" alt="google-logo" />
      <span className="log-in-card__google-button-text">{t("login.google.button")}</span>
    </Button>
  )
}