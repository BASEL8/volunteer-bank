import React, { useEffect, useRef } from 'react'
import { geolocated, GeolocatedProps } from "react-geolocated";
import { useMutation } from '@apollo/react-hooks'
import { GENERATE_ADDRESS } from '../../../../lib/graphql/mutations'
import { useTranslation } from 'react-i18next'
interface Props {
  label?: string;
  refetchUserData: () => void
}
const Geo: React.FC<Props & GeolocatedProps> = ({ refetchUserData, coords, isGeolocationAvailable, isGeolocationEnabled }) => {
  const { t, } = useTranslation()
  const [convertGeo, { error, loading, data }] = useMutation(GENERATE_ADDRESS, {
    variables: {
      lng: coords ? coords?.longitude : 12.6944,
      lat: coords ? coords?.latitude : 56.1357
    },
    onCompleted: data => refetchUserData(),
    onError: data => console.log(data)
  })
  const convertGeoRef = useRef(convertGeo)
  useEffect(() => {
    if (coords) {
      convertGeoRef.current()
    }
  }, [coords])
  if (error) {
    return <p>{t("geo.error")}</p>
  }
  return (
    <div>
      <div>
        {!isGeolocationAvailable ? (
          <div>{t("geo.browser.support")}</div>
        ) : !isGeolocationEnabled ? (
          <div>{t("geo.disabled")}</div>
        ) : (coords && !loading) ? (
          data ? <div>{data.generateUserLocation}</div> : null
        ) : null}
      </div>
    </div >
  )
}
export default geolocated({
  suppressLocationOnMount: true,
  positionOptions: {
    enableHighAccuracy: true
  }
})(Geo);
