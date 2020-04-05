import React from 'react'
import styled from 'styled-components'
import { Form, Select } from 'antd'
import { useTranslation } from 'react-i18next'

const { Item } = Form
export const FilterLanguage: React.FC<{}> = () => {
  const { t, } = useTranslation()

  return (
    <>
      <Container name="language" style={{ margin: 0 }}>
        <Select defaultValue="swedish" >
          <Select.Option value="swedish">{t("filter.swedish.language")}</Select.Option>
          <Select.Option value="arabic">{t("filter.arabic.language")}</Select.Option>
          <Select.Option value="english">{t("filter.english.language")}</Select.Option>
          <Select.Option value="somali">{t("filter.somali.language")}</Select.Option>
        </Select>
      </Container >
    </>
  )
}

const Container = styled(Item)`
flex:1;
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
padding:10px;
width:100%;
padding:10px;
`
