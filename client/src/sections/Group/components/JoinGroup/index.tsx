import React, { useState } from 'react'
import { Button, Modal, Select, Form, Spin } from 'antd'
import { useMutation } from '@apollo/react-hooks'
import { JOIN_GROUP } from '../../../../lib/graphql/mutations'
import { joinGroup as joinGroupData, joinGroupVariables } from '../../../../lib/graphql/mutations/JoinGroup/__generated__/joinGroup'
import { displayErrorMessage, displaySuccessNotification } from '../../../../lib/utils'
import { useTranslation } from 'react-i18next'
interface Props {
  id: string
}
const { Option } = Select
const { Item } = Form;
export const JoinGroup: React.FC<Props> = ({ id }) => {
  const { t, } = useTranslation()
  const [visible, setVisible] = useState<boolean>(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const languages = ['Arabic', 'Swedish', 'English', 'Somali'];
  const handleChange = (value: any) => {
    setSelectedLanguages(value.languages)
  }
  const [joinGroup, { loading }] = useMutation<joinGroupData & joinGroupVariables>(JOIN_GROUP, {
    onCompleted: data => {
      if (data) {
        console.log(data)
        setVisible(false);
        displaySuccessNotification(t('group.join.success'))
      }
    },
    onError: error => {
      if (error) {
        setVisible(false);
        displayErrorMessage(t('group.join.error'))
      }
    }
  })
  const handleJoinGroup = () => {
    if (selectedLanguages.length === 0) {
      return displayErrorMessage(t("group.join.error.language"))
    }
    joinGroup({
      variables: {
        id,
        languages: selectedLanguages
      }
    })
  }
  return (
    <div>
      <Modal
        visible={visible}
        title="Send Join Group Request"
        onOk={handleJoinGroup}

      >
        <Form onValuesChange={handleChange}>
          {loading ? <Spin /> : <Item label="Languages" name="languages" help="chose language or insert one" labelCol={{ span: 24 }}>
            <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
              {
                languages.map((lang, i) => <Option value={lang} key={lang}>{lang}</Option>)
              }
            </Select>
          </Item>}
        </Form>
      </Modal>
      <Button type="primary" onClick={() => setVisible(true)} disabled={loading}>{t("group.join.now")}</Button>
    </div>
  )
}