import React, { useState } from 'react'
import { Divider, Form, Typography, Button, Input, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload';
import { useMutation } from '@apollo/react-hooks'
import { CREATE_GROUPE } from '../../../../lib/graphql/mutations'
import { createGroup as createGroupData, createGroupVariables } from '../../../../lib/graphql/mutations/CreateGroupe/__generated__/createGroup'
import { displayErrorMessage } from '../../../../lib/utils'
import { LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
interface Props {
  refetchUserData: () => void
}
const { Item } = Form;
const { TextArea } = Input;
const { Title } = Typography;
export const CreateGroupe: React.FC<Props> = ({ refetchUserData }) => {
  const { t, } = useTranslation()
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
  const [createGroup, { loading }] = useMutation<createGroupData & createGroupVariables>(CREATE_GROUPE, {
    onCompleted: data => {
      if (data) {
        refetchUserData()
      }
    },
    onError: error => console.log(error)
  })
  const handleOnFinish = (c: any) => {
    if (!imageBase64Value) {
      return displayErrorMessage("Image is required")
    }
    createGroup({
      variables: {
        ...c,
        avatar: imageBase64Value
      }
    })
  }
  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, imageBase64Value => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };
  return (
    <div>
      <Divider />
      <Title level={4}>{t("create.group.title")}</Title>
      <Form onFinish={handleOnFinish}>
        <Item label={t("create.group.name")} name="name" labelCol={{ span: 24 }}>
          <Input />
        </Item>
        <Item label={t("create.group.description")} name="description" labelCol={{ span: 24 }}>
          <TextArea />
        </Item>
        <p>{t("create.group.logo")}</p>
        <Upload
          name="image"
          listType="picture-card"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeImageUpload}
          onChange={handleImageUpload}
        >
          {imageBase64Value ? (
            <img src={imageBase64Value} alt="profile" style={{ width: 70 }} />
          ) : (
              <div>
                {imageLoading ? <LoadingOutlined /> : <PlusCircleOutlined />}
                <div className="ant-upload-text">{t("create.group.upload")}</div>
              </div>
            )}
        </Upload>
        <Item>
          <Button type="primary" htmlType="submit" loading={loading}>{t("create.group.create")}</Button>
        </Item>
      </Form>
      <Divider />
    </div>
  )
}

const beforeImageUpload = (file: File) => {
  const fileIsValidImage = file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 1MB in size!"
    );
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};
