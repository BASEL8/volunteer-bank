import React, { useState } from 'react'
import { Form, Input, Button, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { displayErrorMessage, displaySuccessNotification } from '../../../../../../lib/utils';
import { LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/react-hooks'
import { SIGNUP } from '../../../../../../lib/graphql/mutations'
import { SignupVariables, Signup as SignupData } from '../../../../../../lib/graphql/mutations/Signup/__generated__/Signup'
interface Props {
  setActiveTab: (key: string) => void
}
const { Item, useForm } = Form;
export const Signup: React.FC<Props> = ({ setActiveTab }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
  const [form] = useForm()
  const [signup, { loading }] = useMutation<SignupData, SignupVariables>(SIGNUP, {
    onCompleted: data => {
      if (data) {
        displaySuccessNotification('your account created successfully,use your email and password to login')
        setActiveTab('1')
        form.resetFields();
        setImageBase64Value(null)
      }
    },
    onError: (error) => { console.log(error); displayErrorMessage(`Error : ${error}`) }
  })
  const onFinish = (values: any) => {
    if (!imageBase64Value) {
      return displayErrorMessage("Image is required")
    }
    signup({
      variables: {
        input: {
          ...values,
          avatar: imageBase64Value
        }
      }
    })
  };

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
    <Form
      form={form}
      name="basic"
      initialValues={{ remember: false }}
      onFinish={onFinish}
    >
      <Item name="contact" rules={[{ required: true, message: 'Please insert your email!' }]}>
        <Input placeholder="Email" required />
      </Item>
      <Item name="name" rules={[{ required: true, message: 'Please insert your name!' }]}>
        <Input placeholder="Name" required />
      </Item>
      <Item name="password" rules={[{ required: true, message: 'Please insert your password!' }]}>
        <Input.Password placeholder="Password" />
      </Item>
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
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
      </Upload>
      <Item >
        <Button type="primary" htmlType="submit" disabled={loading}>
          {
            loading ? <LoadingOutlined /> : 'Signup'
          }
        </Button>
      </Item>
    </Form>
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
