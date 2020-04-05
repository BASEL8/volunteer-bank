import React, { useState, ElementType } from 'react'
import styled from 'styled-components'
import { Layout, Card, Avatar } from 'antd'
import { UserAddOutlined, LikeOutlined, StarOutlined, TeamOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'
import { iconColor } from '../../../../../../lib/utils'
import GoogleMapReact, { ChangeEventValue } from 'google-map-react';
import { MapDataList } from '../MapDataList'
import { getCurrentMapData_getCurrentMapData_result } from '../../../../../../lib/graphql/queries/MapData/__generated__/getCurrentMapData';
import { useHistory } from 'react-router-dom';
import { Viewer } from '../../../../../../lib/types';
const { Meta } = Card;
const { Content } = Layout
interface IconTextProps {
  icon: ElementType
  text: string
  onClick?: () => void
}
const IconText: React.FC<IconTextProps> = ({ icon, text, onClick }) => (
  <span onClick={onClick}>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);
const Mark = ({ id, visible, zoom, text, avatar }:
  { text: string, lat: number | null, lng: number | null, id: string, visible: string, zoom: number, avatar: string | null }) => {
  const history = useHistory()
  const { t, } = useTranslation()
  return (
    <MarkBody theme={{ zoom }}>
      <Dot />
      {visible === id && <CustomCard
        loading={false}
        actions={[
          <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
          <IconText icon={TeamOutlined} text="300" key="list-vertical-like-o" />,
          <IconText icon={UserAddOutlined} text={t("map.mark.join")} key="list-vertical-like-o" onClick={() => { history.push(`/group/${id}`) }} />,
        ]}
      >
        <Meta
          avatar={
            avatar && <Avatar src={avatar} />
          }
          title={text}
          description="This is the description"
        />
      </CustomCard>}
    </MarkBody>
  )
}
interface addressToGeoLocationProps {
  lat: number
  lng: number
}
interface MapProps {
  addressToGeoLocation: addressToGeoLocationProps
  users: getCurrentMapData_getCurrentMapData_result[]
  setCurrentData: (
    { maxLng, minLng, maxLat, minLat }: {
      maxLng: number,
      minLng: number,
      maxLat: number,
      minLat: number
    }
  ) => void
  helpRequests: any
  page: number
  limit: number
  setPage: (page: number) => void
  viewer: Viewer
}
export const GoogleMap: React.FC<MapProps> = ({
  setCurrentData, users, helpRequests, page, limit, setPage, addressToGeoLocation, viewer
}) => {
  const [visible, setVisible] = useState<string>('0')
  const [zoom, setZoom] = useState<number>(12)
  const handleChange = (event: ChangeEventValue) => {
    const { bounds } = event
    const boundsData = {
      maxLat: 0,
      minLat: 0,
      maxLng: 0,
      minLng: 0
    }
    boundsData.maxLat = bounds.nw.lat
    boundsData.minLat = bounds.se.lat
    boundsData.maxLng = bounds.se.lng
    boundsData.minLng = bounds.nw.lng
    setCurrentData({ ...boundsData })

  }
  return (
    <Container>
      <div style={{ height: "100%", width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyDuIb87xybM6TxGhi0PZBUlb7mG4-PEU8A',
          }}
          defaultCenter={{
            lat: 1,
            lng: 1
          }}
          center={{
            lat: addressToGeoLocation.lat,
            lng: addressToGeoLocation.lng,
          }}
          debounced={true}
          onChange={handleChange}
          defaultZoom={10}
          onChildClick={e => setVisible(e)}
          onClick={e => setVisible('')}
          onZoomAnimationStart={(e) => setZoom(e)}
          onZoomAnimationEnd={(e) => setZoom(e)}
          options={{
            backgroundColor: 'white'
          }}
          onTilesLoaded={() => console.log(1)}
        >
          {
            users.map(({ id, geoLocation, name, avatar }, index) => geoLocation ?
              <Mark
                lat={geoLocation.lat}
                lng={geoLocation.lng}
                text={name}
                id={id}
                visible={visible}
                zoom={zoom}
                key={id}
                avatar={avatar} />
              : null)
          }
        </GoogleMapReact>
        <MapLeftList>
          <MapDataList page={page} setPage={setPage} helpRequests={helpRequests} limit={limit} simplePagination={true} viewer={viewer} />
        </MapLeftList>
      </div>
    </Container >
  )
}
const Container = styled(Content)`
display:flex;
justify-content:center;
align-items:center;
min-height:400px;
width:100%;
height:100%;
position:relative;
`
const MapLeftList = styled.div`
position:absolute;
height:100%;
left:0;
bottom:0px;
background:#ffffff30;
& .user-listings .ant-list-pagination{
  padding-bottom: 15px;
  margin-top:0px;
};
& .ant-list-item {
  padding:4px 0;
};
& .ant-list-split .ant-list-item{
  border-bottom:none;
}
& .ant-list-something-after-last-item .ant-spin-container > .ant-list-items > .ant-list-item:last-child{
  border-bottom:none;
}
 @media (max-width: 600px) {
        display:none;
    }
`
const MarkBody = styled.div`
width:${({ theme: { zoom } }) => `${zoom * .8}px`};
height:${({ theme: { zoom } }) => `${zoom * .8}px`};;
background-color:${iconColor};
position: relative;
border-radius:50%;
`
const Dot = styled.div`
width:300%;
height:300%;
border-radius:50%;
background-color:${iconColor};
opacity:.4;
transform:translate(-32%,-32%);
`
const CustomCard = styled(Card)`
 width: 300px;
 margin-top: 16px;
 position: absolute;
 top: 5; 
 &::after {
   content:' ';
   position:absolute;
   top:-20px;
   width:0px;
   height:0px;
   border-bottom: 20px solid white;
   border-right: 20px solid transparent;
 }
`