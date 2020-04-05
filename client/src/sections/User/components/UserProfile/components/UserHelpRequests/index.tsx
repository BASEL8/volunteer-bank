import React from 'react'
import { User } from '../../../../../../lib/graphql/queries/User/__generated__/User'
import { Typography, List, Card } from 'antd'
import { useTranslation } from 'react-i18next'
interface Props {
  helpRequests: User['user']['helpRequests']
  helpRequestsPage: number
  limit: number
  setHelpRequestsPage: (page: number) => void
}
const { Title, Paragraph } = Typography
export const UserHelpRequests: React.FC<Props> = ({ helpRequests, helpRequestsPage, limit, setHelpRequestsPage }) => {
  const { t, } = useTranslation()
  const total = helpRequests ? helpRequests.total : null
  const result = helpRequests ? helpRequests.result : null
  const userHelpRequestsList = helpRequests ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 4
      }}
      dataSource={result || undefined}
      locale={{ emptyText: t("user.profile.help.requests.empty") }}
      pagination={{
        position: "top",
        current: helpRequestsPage,
        total: total || undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setHelpRequestsPage(page)
      }}
      renderItem={(helpRequest: any) => {
        return (
          <List.Item
          >
            <Card title={helpRequest.title} >
              {helpRequest.description}
            </Card>
          </List.Item>
        )
      }}
    />
  ) : null
  const userBookingsElement = userHelpRequestsList ? (
    <div className="user-listings">
      <Title level={4} className="user-listings__title">{t("user.profile.help.requests.title")}</Title>
      <Paragraph className="user-listings__description">
        {t("user.profile.help.requests.help.text")}
      </Paragraph>
      {userHelpRequestsList}
    </div>
  ) : null;
  return userBookingsElement;
}