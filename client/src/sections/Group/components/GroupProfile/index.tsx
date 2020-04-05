import React from 'react'
import { group } from '../../../../lib/graphql/queries/Group/__generated__/group'
import { Typography, Avatar, Divider, Button, Col, Row, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { HeartTwoTone, LikeOutlined } from '@ant-design/icons';
interface Props {
  group: group['group']
}
const { Paragraph, Title, Text } = Typography;
export const GroupProfile: React.FC<Props> = ({ group }) => {
  const { t, } = useTranslation()
  const groupMembersElement = group.groupMembers.map(({ id, avatar }) => <Link key={id} to={`/user/${id}`}><Avatar src={avatar ? avatar : ''} /></Link>)
  return (
    <div>
      <Avatar src={group.avatar} />
      <Title level={4}>{t("group.profile.details")}</Title>
      <Paragraph>
        {t("group.profile.name")} : <Text strong>{group.name}</Text>
      </Paragraph>
      <Paragraph>
        {t("group.profile.description")} : <Text>{group.description}</Text>
      </Paragraph>
      <Paragraph>
        {t("group.profile.address")} : <Text>{group.address}</Text>
      </Paragraph>
      <Paragraph>
        {t("group.profile.by")} : <Text>{group.by}</Text>
      </Paragraph>
      <Divider />
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title={t("group.profile.feedback")} value={1128} prefix={<LikeOutlined />} />
        </Col>
        <Col span={8}>
          <Statistic title={t("group.profile.tasksDone")} value={193} suffix="/ 200" />
        </Col>
        <Col span={8}>
          <Button size="large" type="danger" >{t("group.profile.donate")} <HeartTwoTone twoToneColor={'#5fee5f'} /> </Button> <Paragraph> {t("group.profile.soon")}</Paragraph>
        </Col>
      </Row>
      <Divider />
      <Divider />
      <Title level={4}>{t("group.profile.members")}</Title>
      {groupMembersElement}
      <Divider />

    </div >
  )
}