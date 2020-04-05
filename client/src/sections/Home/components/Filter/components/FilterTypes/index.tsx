import React from 'react'
import styled from 'styled-components'
import { Form, Radio } from 'antd'
import { OutsideSvg, InsideSvg, ShoppingSvg } from '../assets'
import { useTranslation } from 'react-i18next'

const { Item } = Form;
export const FilterTypes: React.FC<{}> = () => {
  const { t, } = useTranslation()

  return (
    <>
      <Container name="typeOfHelp">
        <Radio.Group style={{ width: '100%', display: 'flex' }} >
          <CustomRadio value="outside">
            <Box>
              <OutsideSvg />
              <p>{t("filter.type.outside")}</p>
            </Box>
          </CustomRadio>
          <CustomRadio value="inside">
            <Box>
              <InsideSvg />
              <p>{t("filter.type.inside")}</p>
            </Box>
          </CustomRadio>
          <CustomRadio value="shopping">
            <Box>
              <ShoppingSvg />
              <p>{t("filter.type.shopping")}</p>
            </Box>
          </CustomRadio>
          <CustomRadio value="digital">
            <Box>
              <InsideSvg />
              <p>{t("filter.type.digital")}</p>
            </Box>
          </CustomRadio>
        </Radio.Group>
      </Container>
    </>
  )
}

const Container = styled(Item)`
flex:2;
width:100%;
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
width:100%;
padding:10px;
margin:0;
`
const CustomRadio = styled(Radio.Button)`
height: 100%; 
width: 100%; 
padding: 0;
border-left:none;
&::before{
  background-color:transparent !important;
}
`
const Box = styled.div`
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
margin:10px;
border-radius:2px;
flex-basis:45%;
&  svg  {
  width:50px;
  height:50px;
  background:#F8F8F8;
  border-radius:50%;
};
& p {
  font-size:15px;
}
`