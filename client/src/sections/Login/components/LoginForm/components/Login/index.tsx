import React from 'react'
import { Form, Input, Button } from 'antd';
import { useMutation } from '@apollo/react-hooks'
import { LOGIN_EMAIL } from '../../../../../../lib/graphql/mutations'
import { LoginEmail as LoginData, LoginEmailVariables } from '../../../../../../lib/graphql/mutations/LoginEmail/__generated__/LoginEmail'
import { Redirect } from 'react-router-dom'
import { displaySuccessNotification, displayErrorMessage } from '../../../../../../lib/utils';
import { LoadingOutlined } from '@ant-design/icons'
import { Viewer } from '../../../../../../lib/types';

interface Props {
  setViewer: (viewer: Viewer) => void
}
const { Item, useForm } = Form
export const Login: React.FC<Props> = ({ setViewer }) => {
  const [form] = useForm()
  const [login, { data, loading }] = useMutation<LoginData, LoginEmailVariables>(LOGIN_EMAIL, {
    onCompleted: (data) => {
      displaySuccessNotification('you logged in successfully')
      form.resetFields()
      setViewer(data.loginEmail)
      if (data.loginEmail.token) {
        window.sessionStorage.setItem('token', data.loginEmail.token)
      } else {
        window.sessionStorage.removeItem('token')
      }
    },
    onError: (error) => {
      displayErrorMessage(`${error}`)
      form.resetFields()
    }
  })
  const onFinish = (values: any) => {
    login({
      variables: {
        input: {
          ...values
        }
      }
    })
  };
  if (data && data.loginEmail) {
    const { id: viewerId } = data.loginEmail;
    return <Redirect to={`/user/${viewerId}`} />
  }
  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      form={form}
    >
      <Item name="contact" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input placeholder="Email" />
      </Item>
      <Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password placeholder="Password" />
      </Item>
      <Item >
        <Button type="primary" htmlType="submit">
          {
            loading ? <LoadingOutlined /> : 'Login'
          }
        </Button>
      </Item>
    </Form>
  )
}