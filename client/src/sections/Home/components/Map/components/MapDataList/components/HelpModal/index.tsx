import React from 'react'
import { Modal, Select } from 'antd'
import { getCurrentMapData_getCurrentMapData_helpRequests_result as HelpRequestTypes } from '../../../../../../../../lib/graphql/queries/MapData/__generated__/getCurrentMapData'
import { useTranslation } from 'react-i18next'
interface Props {
  visible: boolean
  setVisible: (visible: boolean) => void
  modalData: HelpRequestTypes | null
}
const { Option } = Select
export const HelpModal: React.FC<Props> = ({ visible, setVisible, modalData }) => {
  const { t, } = useTranslation()
  const handleOk = () => {
    setVisible(false)
  };

  const handleCancel = () => {
    setVisible(false)
  };

  return (
    <div>
      <Modal
        title={modalData && modalData.title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered={false}
      >
        <p>{t("modal.description")} : {modalData && modalData.description}</p>
        <p>{t("modal.language")} : {modalData && modalData.language}</p>
        {t("modal.select")}
        <div>
          <Select style={{ width: '100%' }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </div>
      </Modal>
    </div>
  )
}