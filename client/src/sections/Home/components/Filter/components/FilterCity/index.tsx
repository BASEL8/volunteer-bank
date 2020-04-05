import React, { useState } from 'react'
import { Select, Form } from 'antd'
import { displayErrorMessage } from '../../../../../../lib/utils';
import styled from 'styled-components'
import { useMutation } from '@apollo/react-hooks'
import { AUTO_COMPLETE_CITY, GENERATE_GEOLOCATION } from '../../../../../../lib/graphql/mutations'
import { autoCompleteAddress, autoCompleteAddressVariables } from '../../../../../../lib/graphql/mutations/AutoCompleteAddress/__generated__/autoCompleteAddress'

interface setAddressToGroLocationProps {
  lng: number
  lat: number
}
interface Props {
  setAddressToGroLocation: (values: setAddressToGroLocationProps) => void
}

const { Option } = Select;
export const FilterCity: React.FC<Props> = ({ setAddressToGroLocation }) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [addresses, setAddresses] = useState<string[]>([])
  const [autoComplete] = useMutation<autoCompleteAddress, autoCompleteAddressVariables>(
    AUTO_COMPLETE_CITY, {
    onCompleted: data => {
      if (data && data.autoCompleteAddress) {
        setAddresses(data.autoCompleteAddress)
      }
    },
    onError: error => displayErrorMessage(`there is no such place`)
  }
  )
  const [generateGeoLocation] = useMutation(GENERATE_GEOLOCATION, {
    onCompleted: (data) => {
      if (data && data.generateGeoAddress && data.generateGeoAddress.geoLocation) {
        setAddressToGroLocation({ ...data.generateGeoAddress.geoLocation })
      }
    },
    onError: error => console.log(error)
  })

  const handleChange = (value: any) => {
    console.log(value)
    generateGeoLocation({
      variables: {
        userAddress: value
      }
    })
    setSearchValue(value)

  }
  const handleSearch = (value: string) => {
    if (value.length > 4) {
      autoComplete({
        variables: {
          cityName: value
        }
      })
    }
  }

  const options = addresses.length > 0 ? addresses.map((a, i) => <Option key={i} value={a}>{a}</Option>) : null
  return (
    <Container name="address">
      <Select
        showSearch
        value={searchValue}
        placeholder='city'
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onChange={handleChange}
        onSearch={handleSearch}
        notFoundContent={null}
      >
        {options}
      </Select>
    </Container>
  )
}
const Container = styled(Form.Item)`
flex:2;
display:flex;
flex-basis:300px;
align-items:center;
justify-content:center;
flex-direction:column;
width:100%;
padding:10px;
margin:0;
`

