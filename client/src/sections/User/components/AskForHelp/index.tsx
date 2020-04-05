import React from 'react'
import { Form, Input, Button, Radio, Select } from 'antd';
import { useMutation } from '@apollo/react-hooks'
import { HELP_REQUEST } from '../../../../lib/graphql/mutations'
import styled from 'styled-components';
import { displaySuccessNotification, displayErrorMessage } from '../../../../lib/utils';
import { useTranslation } from 'react-i18next'
import { SizeType } from 'antd/lib/config-provider/SizeContext';
const { Item } = Form;
interface Props {
  refetchUserData: () => void
  size: SizeType
}
export const AskForHelpContent: React.FC<Props> = ({ refetchUserData, size }) => {
  const { t, } = useTranslation()
  const [createAskHelp, { loading }] = useMutation(HELP_REQUEST, {
    onCompleted: () => {
      displaySuccessNotification(t("user.profile.creat.request.success"));
      refetchUserData();
    },
    onError: (error) => {
      displayErrorMessage(t("user.profile.create.request.error"))
    }
  })
  const HandleOnFinish = (data: any) => {
    createAskHelp({
      variables: { input: { ...data } }
    })
  }
  return (
    <CustomForm
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      layout="horizontal"
      style={{ width: '100%' }}
      onFinish={HandleOnFinish}
      scrollToFirstError
      validateMessages={{ default: 'all' }}
      initialValues={{ type: 'shopping', language: 'swedish' }}
      size={size}
    >
      <CustomItem name="title" required>
        <Input required placeholder={t("user.profile.input.title")} />
      </CustomItem>
      <CustomItem name="description" required>
        <Input required placeholder={t("user.profile.input.description")} />
      </CustomItem>
      <CustomItem label={t("user.profile.input.type")} name="type" required>
        <Radio.Group defaultValue="shopping">
          <Radio.Button value="outside">{t("filter.type.outside")}</Radio.Button>
          <Radio.Button value="inside">{t("filter.type.inside")}</Radio.Button>
          <Radio.Button value="shopping">{t("filter.type.shopping")}</Radio.Button>
          <Radio.Button value="digital">{t("filter.type.digital")}</Radio.Button>
        </Radio.Group>
      </CustomItem>
      <CustomItem label={t("user.profile.input.language")} name="language" required>
        <Select defaultValue="swedish" >
          <Select.Option value="swedish">{t("filter.swedish.language")}</Select.Option>
          <Select.Option value="arabic">{t("filter.arabic.language")}</Select.Option>
          <Select.Option value="english">{t("filter.english.language")}</Select.Option>
          <Select.Option value="somali">{t("filter.somali.language")}</Select.Option>
        </Select>
      </CustomItem>
      <CustomItem>
        <Button htmlType="submit" type="primary" loading={loading}>{t('user.profile.input.submit')}</Button>
      </CustomItem>
    </CustomForm >

  )
}
const CustomForm = styled(Form)`
flex:1;
display:flex;
flex-direction:column;
justify-content:stretch;
align-items:stretch;
width:100%;
`
const CustomItem = styled(Item)`
display:flex;
flex-direction:column;
justify-content:stretch;
align-items:flex-start;
`