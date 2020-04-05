import React, { useState } from 'react'
import { Map, Filter, HomeHero } from './components'
import styled from 'styled-components'
import { Layout, Typography } from 'antd'
import { Viewer } from '../../lib/types'
interface Props {
  viewer: Viewer
}
interface filterValuesTypes {
  language: string,
  typeOfHelp: string
  address: string
}
interface addressToGeoLocationProps {
  lat: number
  lng: number
}
const { Content } = Layout
export const Home: React.FC<Props> = ({ viewer }) => {
  const [filters, setFilterValues] = useState<filterValuesTypes>({ language: 'arabic', typeOfHelp: 'outside', address: 'Åragatan, Helsingborg, Sweden' })
  const [addressToGeoLocation, setAddressToGroLocation] = useState<addressToGeoLocationProps>({ lat: 56.069530, lng: 12.701720 })
  return (
    <Container>
      <HomeHero viewer={viewer} />
      <Filter filters={filters} setFilterValues={setFilterValues} setAddressToGroLocation={setAddressToGroLocation} />
      <Map addressToGeoLocation={addressToGeoLocation} language={filters.language} typeOfHelp={filters.typeOfHelp} viewer={viewer} />
    </Container>
  )
}


const Container = styled(Content)`
display:flex;
flex:1;
flex-direction:column;
justify-content:center;
align-items:center;
flex:1;
padding-bottom:20px;
`