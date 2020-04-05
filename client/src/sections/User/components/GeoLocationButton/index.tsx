import React, { useRef } from 'react'
import { Button, Typography, Form, Input, Divider, Spin } from 'antd'
import styled from 'styled-components'
import { AimOutlined } from '@ant-design/icons'
import Geo from './geo'
import { useMutation } from "@apollo/react-hooks";
import { GENERATE_USER_GEOLOCATION } from '../../../../lib/graphql/mutations'
import { generateUserAddress as GenerateAdressData, generateUserAddressVariables } from '../../../../lib/graphql/mutations/ConvertAddressToGeolocation/__generated__/generateUserAddress'
import { displayErrorMessage } from '../../../../lib/utils'
import { useTranslation } from 'react-i18next'
interface Props {
  refetchUserData: () => void
}
const { Text } = Typography;
const { Item } = Form
export const GeoLocationButton: React.FC<Props> = ({ refetchUserData }) => {
  const { t, } = useTranslation()
  const [generateGeoLocation, { error, loading }] = useMutation<GenerateAdressData & generateUserAddressVariables>(GENERATE_USER_GEOLOCATION, {
    onCompleted: () => refetchUserData(),
    onError: error => console.log(error)
  })

  const onFinish = (values: any) => {
    generateGeoLocation({
      variables: {
        userAddress: `${values.street},${values.city},${values.state},${values.country}`
      }
    })
  };
  const innerRef: any = useRef();
  const getLocation = () => {
    innerRef.current && innerRef.current.getLocation();
  };
  if (error) {
    displayErrorMessage(t('geo.error.save'))
  }
  return (
    <Container>
      <Text>{t("geo.warning")}</Text>
      {<Geo ref={innerRef} refetchUserData={refetchUserData} />}
      <Button type="primary" onClick={getLocation}><AimOutlined />{t('geo.form.get.location')}</Button>
      <Divider />
      <Text>{t('geo.form.title')} </Text>
      <Form name="control-hooks" onFinish={onFinish}>
        <Item name="street" rules={[{ required: true }]}>
          <Input placeholder={t('geo.form.street')} />
        </Item>
        <Item name="city" rules={[{ required: true }]}>
          <Input placeholder={t('geo.form.city')} />
        </Item>
        <Item name="state" rules={[{ required: true }]}>
          <Input placeholder={t('geo.form.state')} />
        </Item>
        <Item name="country" rules={[{ required: true }]}>
          <Input placeholder={t('geo.form.country')} />
        </Item>
        <Item>
          <Button type="primary" htmlType="submit" disabled={loading}>{loading ? <Spin size="small" /> : t("geo.form.submit")}</Button>
        </Item>
      </Form>
    </Container>
  )
}

const Container = styled.div`
display:flex;
flex-direction:column;
align-content:center;
justify-content:center;
max-width:200px;
text-align:center;
& > * {
  margin :10px 0px;
}
`


