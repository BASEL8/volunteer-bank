import React from 'react'
import styled from 'styled-components'
import { Typography, Form, Divider, Button } from 'antd'
import { FilterTypes, FilterLanguage, FilterCity } from './components'
import { useTranslation } from 'react-i18next'

interface filterValuesTypes {
  language: string,
  typeOfHelp: string
  address: string
}
interface setAddressToGroLocationProps {
  lng: number
  lat: number
}
interface Props {
  setFilterValues: (filters: filterValuesTypes) => void
  filters: filterValuesTypes
  setAddressToGroLocation: (data: setAddressToGroLocationProps) => void
}
const { Title, Text } = Typography
export const Filter: React.FC<Props> = ({ setFilterValues, filters, setAddressToGroLocation }) => {
  const { t, } = useTranslation()

  const onFinish = (c: any) => {
    setFilterValues({ ...c })
  }
  return (
    <Container name="search" onFinish={onFinish} className="filter__container" initialValues={filters}>
      <Title style={{ width: '100%', textAlign: 'center' }} level={4}> {t("filter.title")} </Title>
      <Text style={{ width: '100%', textAlign: 'center' }} > {t("filter.help.text")} </Text>
      <FilterTypes />
      <FilterLanguage />
      <FilterCity setAddressToGroLocation={setAddressToGroLocation} />
      <Button htmlType="submit" type="primary">{t('filter.search')}</Button>
    </Container >
  )
}
const Container = styled(Form)`
flex:1;
display:flex;
justify-content:space-around;
align-items:center;
height:100%;
width:100%;
flex-wrap:wrap;
padding:0px 15px;
margin-bottom:10px;
`