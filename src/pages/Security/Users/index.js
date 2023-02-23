import { Button, Form, List, Transfer, Typography } from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import API from '../../../services/Security';
import './Users.css';

const { Title } = Typography;

const Users = () => {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [radioValue, setRadioValue] = useState(1);
    const [user, setUser] = useState([]);
    const [office, setOffice] = useState([]);
    const [userPermission, setUserPermission] = useState([]);
    const [roles, setRoles] = useState([]);
    const [saveButton, setSaveButton] = useState(true);
    const [userId, setUserId] = useState([]);
    const [status, setStatus] = useState(0);
    const [enStatus, setEnStatus] = useState([]);
    const [usrRoles, setUsrRoles] = useState([]);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [listLoading, setListLoading] = useState(false);

    const changeStatus = (e) => {
        setStatus(e.target.value);
    };

    const roleData = roles?.map((role) => ({
        key: role.name,
        title: role.name,
    }));

    const onChange = (nextTargetKeys) => {
        setUsrRoles(nextTargetKeys);
    };

    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };
    const reset = async () => {
        await formRef.current?.resetFields();
        setSelectedUser([]);
        getUser();
        setAction('A');
    };

    const onFinish = async (values) => {
        const formValue = form.getFieldValue();
        let permission = formValue.moduleFunctions;
        const userRoles = formValue.grant_role;
        const data = {
            officeId: formValue.officeId,
            userName: formValue.username,
            employeeId: formValue.employeeId,
            contact: formValue.contact,
            email: formValue.email,
            name: formValue.name,
            password: formValue.password,
            status,
            role: userRoles.map((x) => ({ name: x })),
            // userModuleFunctions: permission
            //     .map((y) => y.fn)
            //     .flat()
            //     .map((x) => ({ moduleFunctionId: x.split(',')[0] })),
        };

        saveButton == true
            ? await API.user.post(data, setLoadSubmit)
            : await API.user.put(userId, data, setLoadSubmit);
        form.setFieldsValue({
            username: '',
            employeeId: '',
            contact: '',
            email: '',
            password: '',
            name: '',
            status: 0,
            grant_role: '',
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onRadioChange = (e) => {
        setRadioValue(e.target.value);
    };

    useEffect(async () => {
        const responseOffice = await API.office.get();
        const office = responseOffice?.data?.map((organization) => ({
            ...organization,
        }));
        setOffice(office);

        const responseRoles = await API.role.get();
        const roles = responseRoles?.data?.map((role) => ({
            ...role,
            key: role.id,
        }));
        setRoles(roles);
        const resStatus = await API.enum.status();
        setEnStatus(resStatus?.data);
    }, []);

    const getOfficeUser = async (id) => {
        const responseUser = await API.officeWithUser(id, setListLoading);
        setUser(responseUser?.data);
    };

    const [form] = Form.useForm();

    const getUserDetails = async (id) => {
        const responseUserDetails = await API.user.getById(id);
        let userInfo = responseUserDetails?.data;
        let permissions = userInfo?.userModuleFunctions?.map((x) => [
            x.moduleFunction.module.application.id +
                ',' +
                x.moduleFunction.module.application.name,
            x.moduleFunction.module.id +
                ',' +
                x.moduleFunction.module.description,
            x.moduleFunction.id + ',' + x.moduleFunction.functionName,
        ]);

        setUserId(userInfo.id);
        form.setFieldsValue({
            username: userInfo.userName,
            contact: userInfo.contact,
            employeeId: userInfo.employeeId,
            email: userInfo.email,
            status: userInfo.status,
            password: userInfo.password,
            name: userInfo.name,
            grant_role: userInfo.Role,
            permissions,
        });
        setSaveButton(false);
        setUserPermission(permissions);
        setUsrRoles(responseUserDetails?.data?.userRole?.map((x) => x.roleId));
    };

    return (
        <PageContainer title="Users">
            <ProCard split="vertical">
                <ProCard colSpan="30%">
                    <List
                        header={<div>Users</div>}
                        size="small"
                        bordered
                        loading={listLoading}
                        dataSource={user}
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <Typography.Link>{item.name}</Typography.Link>
                                <div>
                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        key="edit"
                                        onClick={() => {
                                            getUserDetails(item.id);
                                        }}
                                    />
                                    <Button
                                        type="link"
                                        danger
                                        icon={<DeleteOutlined />}
                                        href="https://www.google.com"
                                    />
                                </div>
                            </List.Item>
                        )}
                    />
                </ProCard>
                <ProCard>
                    <ProForm
                        form={form}
                        layout="vertical"
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        submitter={{
                            render: (props, dom) => [
                                <Button
                                    type="primary"
                                    key="submit"
                                    loading={loadSubmit}
                                    id="buttonSubmit"
                                    onClick={() => props.form?.submit?.()}
                                >
                                    {saveButton ? 'Save' : 'Update'}
                                </Button>,
                                <Button
                                    type="default"
                                    key="submit"
                                    id="buttonReset"
                                    onClick={reset}
                                >
                                    Reset
                                </Button>,
                            ],
                        }}
                    >
                        <ProFormSelect
                            name="officeId"
                            label="Office"
                            placeholder="Select office"
                            onChange={(id) => getOfficeUser(id)}
                            options={office.map((item, id) => ({
                                value: item.id,
                                label: item.nameEng,
                            }))}
                        />

                        <ProFormText
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        />
                        <ProFormText
                            label="Email"
                            name="email"
                            type="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email',
                                },
                            ]}
                        />

                        <ProFormText
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your nepali name!',
                                },
                            ]}
                        />

                        <ProFormText
                            label="Contact No"
                            name="contact"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your phone number!',
                                },
                            ]}
                        />

                        <ProFormText.Password
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        />

                        <ProFormText.Password
                            label="Confirm Password"
                            name="confirm_password"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please repeat your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue('password') === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                'The two passwords that you entered do not match!'
                                            )
                                        );
                                    },
                                }),
                            ]}
                            hasFeedback
                        />

                        <ProFormRadio.Group
                            name="status"
                            label="Status:"
                            rules={[
                                {
                                    required: false,
                                    message: 'please give a status',
                                },
                            ]}
                            options={enStatus?.map((x) => ({
                                value: x.id,
                                label: x.name,
                            }))}
                            defaultValue={0}
                            value={status}
                            onChange={changeStatus}
                        />
                        <ProCard
                            tabs={{
                                type: 'card',
                            }}
                        >
                            <ProCard.TabPane key="tab1" tab="Grant Role">
                                <ProFormText
                                    name="grant_role"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Transfer
                                        dataSource={roleData}
                                        titles={['Available', 'Selected']}
                                        targetKeys={usrRoles}
                                        onChange={onChange}
                                        onSelectChange={onSelectChange}
                                        render={(item) => item.title}
                                    />
                                </ProFormText>
                            </ProCard.TabPane>
                            {/* <ProCard.TabPane key="tab2" tab="Assign Module">
                                Two
                            </ProCard.TabPane> */}
                        </ProCard>
                    </ProForm>
                </ProCard>
            </ProCard>
        </PageContainer>
    );
};

export default Users;
