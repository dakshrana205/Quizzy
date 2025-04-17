import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { updateUserProfile, getUserInfo } from '../../apicalls/users';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { SetUser } from '../../redux/usersSlice';
import PageTitle from '../../components/PageTitle';

function Profile() {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      if (response.success) {
        dispatch(SetUser(response.data));
        form.setFieldsValue({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || '',
        });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      // Keep all existing user data and only update what's in the form
      const updatedValues = {
        ...user, // Keep all existing user data including role, _id, etc.
        name: values.name,
        email: values.email,
        phone: values.phone || ''
      };
      
      const response = await updateUserProfile(updatedValues);
      if (response.success) {
        message.success('Profile updated successfully');
        // Reload user data to ensure we have the latest
        await loadUserData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageTitle title="Profile" />
      <div className="flex justify-center">
        <div className="w-400 card p-3">
          <Form 
            layout="vertical" 
            form={form} 
            onFinish={onFinish}
          >
            <Form.Item 
              name="name" 
              label="Name" 
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Profile; 