import React from 'react'
import styled from 'styled-components'
import { Typography, Row, Col } from 'antd'
import { Person, World } from './assets'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import { Viewer } from '../../../../lib/types';
interface Props {
  viewer: Viewer
}
const { Title, Paragraph, Text } = Typography;
export const HomeHero: React.FC<Props> = ({ viewer }) => {
  const { t, } = useTranslation()
  return (
    <Container>
      {!viewer.id ?
        <> <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', zIndex: 0, opacity: .1 }}>
          <World />
        </div>
          <Row style={{ width: '100%' }}>
            <Col xs={24} md={12} >
              <Left>
                <Person />
              </Left>
            </Col>
            <Col xs={24} md={12} >
              <Right>
                <TextHolder>
                  <Title>{t("home.title")}</Title>
                  <Text>{t("home.text_1")}</Text>
                  <Text>{t("home.text_2")}</Text>
                  <Paragraph>{t("home.text_3")}</Paragraph>
                  <Link to="/login">{t("home.signin.button")}</Link>
                </TextHolder>
              </Right>
            </Col>
          </Row>
        </> : null
      }
    </Container>
  )
}
const Container = styled.div`
width:100%;
display:flex;
align-items:center;
justify-content:center;
flex-wrap:wrap;
padding:10px;
padding-bottom:0;
position:relative;
`
const TextHolder = styled.div`
flex:1;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
text-align:center;
height:100%;
`
const Right = styled.div`
height:100%;
flex:1;
margin-bottom:20px;
z-index:99;
padding:20px;
padding-bottom:0px;
& .ant-row.ant-form-item {
  width:100%;
  & .ant-form-item-label{
      max-width:100%;
  }
  & .ant-radio-group{
        display:flex
      }
}
`
const Left = styled.div`
flex:1;
display:flex;
align-items:center;
justify-content:center;
height:100%;
& svg{
  max-width:400px;
}
`