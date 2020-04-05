import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { MAP_DATA } from '../../../../lib/graphql/queries'
import { getCurrentMapData as MapCurrentData, getCurrentMapDataVariables } from '../../../../lib/graphql/queries/MapData/__generated__/getCurrentMapData'
import styled from 'styled-components'
import { GoogleMap, MapDataList } from './components'
import { displayErrorMessage } from '../../../../lib/utils'
import { Typography } from 'antd'
import { Viewer } from '../../../../lib/types'
import { useTranslation } from 'react-i18next'
const PAGE_LIMIT = 4;
interface addressToGeoLocationProps {
  lat: number
  lng: number
}
interface Props {
  addressToGeoLocation: addressToGeoLocationProps
  language: string
  typeOfHelp: string
  viewer: Viewer
}
const { Title, Paragraph } = Typography;
export const Map: React.FC<Props> = ({ addressToGeoLocation, language, typeOfHelp, viewer }) => {
  const { t, } = useTranslation()
  const [currentData, setCurrentData] = useState({
    maxLng: 12.718080963134753,
    minLng: 12.672419036865222,
    maxLat: 56.05526818095288,
    minLat: 56.0384899947872
  })
  const [page, setPage] = useState<number>(1)
  const { data, error } = useQuery<MapCurrentData, getCurrentMapDataVariables>(MAP_DATA, {
    onError: () => displayErrorMessage("we can't get any data from map, please try agin later"),
    variables: {
      ...currentData,
      language,
      typeOfHelp,
      page,
      limit: PAGE_LIMIT
    },
    fetchPolicy: 'network-only'
  })
  if (error) {
    displayErrorMessage('something went wrong, try agin later')
    return null;
  }
  const users = data ? data.getCurrentMapData.result : [];
  const helpRequests = data ? data.getCurrentMapData.helpRequests : null
  const count = users.length > 0 ? users.length : 0;
  const helpRequestsTotal = helpRequests ? helpRequests.total : 0
  return (
    <Container>
      <Title style={{ textAlign: 'center' }} level={4}>
        {t('home.map.count')}
        {count}
        {t('home.map.count_2')}
        {helpRequestsTotal}
        {t('home.map.count_3')}
      </Title>
      <Paragraph style={{ textAlign: 'center' }}> {t('home.map.join')} </Paragraph>
      <GoogleMap
        setCurrentData={setCurrentData}
        addressToGeoLocation={addressToGeoLocation}
        users={users}
        page={page}
        setPage={setPage}
        helpRequests={helpRequests}
        limit={PAGE_LIMIT}
        viewer={viewer}
      />
      <HideElement>
        <MapDataList page={page} setPage={setPage} helpRequests={helpRequests} limit={PAGE_LIMIT} simplePagination={false} viewer={viewer} />
      </HideElement>
    </Container>
  )
}
const Container = styled.div`
height:500px;
width:100%;
position:relative
`
const HideElement = styled.div`
 @media (min-width: 600px) {
        display:none;
    }
`


