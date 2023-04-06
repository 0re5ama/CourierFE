import {
    Button,
    Col,
    Form,
    Input,
    List,
    Radio,
    Row,
    Select,
    Switch,
    Tabs,
    Transfer,
    Typography,
} from 'antd';

import { useEffect, useState } from 'react';
import API from '../../../services/Security';
import './Users.css';

const { Title } = Typography;

const { Option } = Select;
const { TabPane } = Tabs;

const Users = () => {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [radioValue, setRadioValue] = useState(1);
    const [user, setUser] = useState([]);
    const [offices, setOffices] = useState([]);
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

    const onFinish = async (values) => {
        const formValue = form.getFieldValue();
        let permission = formValue.moduleFunctions;
        const userRoles = formValue.grant_role;
        const data = {
			...formValue,
			status,
            role: userRoles.map((x) => ({ name: x })),
            // userModuleFunctions: permission
            //     .map((y) => y.fn)
            //     .flat()
            //     .map((x) => ({ moduleFunctionId: x.split(',')[0] })),
        }; // TODO: fix names and get value automatically
        saveButton
            ? await API.user.post(data, setLoadSubmit)
            : await API.user.put(userId, data, setLoadSubmit);
        form.setFieldsValue({
            username: '',
            employeeId: '',
            contact: '',
            email: '',
            password: '',
            confirm_password: '',
            name: '',
            status: 0,
            grant_role: '',
        });
        getOfficeUser(formValue.officeId);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onRadioChange = (e) => {
        setRadioValue(e.target.value);
    };

    useEffect(async () => {
        const responseOffice = await API.office.get();
        const offices = responseOffice?.data?.map((organization) => ({
            ...organization,
        }));
        setOffices(offices);
        if (offices.length == 1) {
			let officeId = offices[0].id;
            form.setFieldsValue({
                officeId,
            });
			getOfficeUser(officeId);
        }

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
		console.log(userInfo);
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
		console.log(userInfo.roles.map(x => x.name));
        form.setFieldsValue({
			...userInfo,
			grant_role: userInfo.roles.map(x => x.name),
            permissions,
        });
        setSaveButton(false);
        setUserPermission(permissions);
        setUsrRoles(userInfo.roles.map(x => x.name));
    };

    return (
        <div className="Consign-Form">
            <Title level={5}>Users</Title>
            <Row gutter={{ lg: 32, sm: 32, xs: 32 }}>
                <Col span={8}>
                    <List
                        className="userList"
                        size="small"
                        bordered
                        loading={listLoading}
                        dataSource={user}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => getUserDetails(item.id)}
                                key={item.id}
                            >
                                <Typography.Link> {item.name} </Typography.Link>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={15}>
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item label="Office" name="officeId">
                            <Select
                                placeholder=" Select office"
                                onChange={(id) => getOfficeUser(id)}
                            >
                                {offices.map((item, id) => {
                                    return (
                                        <Option key={id} value={item.id}>
                                            {item.nameEng}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>

                        <Row className="userGroup">
                            <Form.Item
                                label="Username"
                                name="userName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input
                                    style={{ width: 420, height: 36 }}
                                    placeholder=""
                                />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                type="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email',
                                    },
                                ]}
                            >
                                <Input
                                    style={{ width: 420, height: 36 }}
                                    placeholder=""
                                />
                            </Form.Item>
                        </Row>

                        <Row className="userGroup">
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter your nepali name!',
                                    },
                                ]}
                            >
                                <Input
                                    style={{ width: 420, height: 36 }}
                                    placeholder=""
                                />
                            </Form.Item>

                            <Form.Item
                                label="Contact No"
                                name="contact"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter your phone number!',
                                    },
                                ]}
                            >
                                <Input
                                    style={{ width: 420, height: 36 }}
                                    placeholder=""
                                />
                            </Form.Item>
                        </Row>

                        <Row className="userGroup">
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: saveButton,
                                        message: 'Please input your password!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    style={{ width: 420, height: 36 }}
                                    placeholder=""
                                    autoComplete="new-password"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Confirm Password"
                                name="confirm_password"
                                dependencies={['password']}
                                rules={[
                                    {
                                        required: saveButton,
                                        message: 'Please repeat your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue('password') ===
                                                    value
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
                            >
                                <Input.Password
                                    style={{ width: 420, height: 36 }}
                                    placeholder=""
                                />
                            </Form.Item>
                        </Row>
                        <Row className="roleGroup">
                            <Form.Item
                                name="status"
                                label="Status:"
                                rules={[
                                    {
                                        required: false,
                                        message: 'please give a status',
                                    },
                                ]}
                            >
                                <Radio.Group
                                    defaultValue={0}
                                    value={status}
                                    onChange={changeStatus}
                                >
                                    {enStatus?.map((x) => {
                                        return (
                                            <Radio key={x.id} value={x.id}>
                                                {x.name}
                                            </Radio>
                                        );
                                    })}
                                </Radio.Group>
                            </Form.Item>
                        </Row>
                        <Row className="roleGroup">
                            <Form.Item
                                name="isSuperAdmin"
								valuePropName="checked"
                                label="Super Admin?"
                            >
								<Switch />
                            </Form.Item>
                        </Row>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Grant Role" key="1">
                                <Form.Item
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
                                </Form.Item>
                            </TabPane>
                            {/* <TabPane tab="Assign Module" key="2">
                                <Permissions
                                    userForm={form}
                                    userPermission={userPermission}
                                />
                            </TabPane> */}
                        </Tabs>
                        <Button
                            loading={loadSubmit}
                            htmlType="submit"
                            type="primary"
                            id="buttonSubmit"
                            style={{ marginTop: 20 }}
                        >
                            {saveButton ? 'Save' : 'Update'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Users;
