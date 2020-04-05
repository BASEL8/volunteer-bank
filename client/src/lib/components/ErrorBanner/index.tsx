import React from 'react'
import Alert from 'antd/lib/alert'

type Props = {
  message?: string
  description?: string
}
export const ErrorBanner: React.FC<Props> = ({ message, description }) => {
  return (
    <Alert message={message} description={description} closable banner type="error" className="error-banner" />
  )
}