import React from 'react'
import { Button } from 'antd'
import facebookLogo from '../../assets/facebook.png'
import { useTranslation } from 'react-i18next'

export const FaceBookButton: React.FC<{}> = () => {
  const { t, } = useTranslation()
  return (
    <Button className="log-in-card__login-button log-in-card__login-button-facebook" disabled>
      <img src={facebookLogo} className="log-in-card__google-button-logo" alt="google-logo" />

      <span className="log-in-card__google-button-text">{t("login.facebook.button")}</span>
      <span className="log-in-card__google-button-text">soon! </span>
    </Button>
  )
}