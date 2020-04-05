import React from 'react'
import styled from 'styled-components'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'

const { Option } = Select
export const ChangeLanguage: React.FC<{}> = () => {
  const { i18n } = useTranslation()
  const language = i18n.language
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
  }
  return (
    <Container>
      <Select defaultValue={language} onChange={changeLanguage} showArrow={false}>
        <Option value="se"><FlagHolder ><span role="img" aria-label="swedish">🇸🇪</span></FlagHolder></Option>
        <Option value="ar"><FlagHolder><span role="img" aria-label="arabic">🇦🇪</span></FlagHolder></Option>
        <Option value="en"><FlagHolder ><span role="img" aria-label="english">🇬🇧</span></FlagHolder></Option>
        <Option value="so"><FlagHolder ><span role="img" aria-label="somali">🇸🇴</span></FlagHolder></Option>
      </Select>
    </Container>
  )
}
const FlagHolder = styled.div`
font-size:25px;
`
const Container = styled.div`
display:flex;
justify-content:flex-end;
align-items:center;
& .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
  border:none
}
`
