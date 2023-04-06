import { Button, Col, Form, Input, List, Radio, Row, Typography } from 'antd';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import API from '../../../services/Security';
import './Role.css';

import Permissions from '../../../components/Permission';
const { Title } = Typography;
const { TextArea } = Input;

const Role = () => {
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [roleInfo, setRoleInfo] = useState();
    const [options, setOptions] = useState([]);
    const [saveButton, setSaveButton] = useState(true);
    const [rolePermission, setRolePermission] = useState([]);
    const [roleId, setRoleId] = useState();
    const [status, setStatus] = useState(0);
    const [enStatus, setEnStatus] = useState([]);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [listLoading, setListLoading] = useState(false);

    const changeStatus = (e) => {
        setStatus(e.target.value);
    };

    const getRoleDetails = async (id) => {
        const responseRoleDetails = await API.role.getById(id);
        let role = responseRoleDetails?.data;
        setRoleId(id);
        setRoleInfo(role);
        let permissions = role?.roleModuleFunctions.map((x) => [
            x.moduleFunction.module.application.id +
                ',' +
                x.moduleFunction.module.application.name,
            x.moduleFunction.module.id +
                ',' +
                x.moduleFunction.module.description,
            x.moduleFunction.id + ',' + x.moduleFunction.functionName,
        ]);
        form.setFieldsValue({
            name: role.name,
            desc: role.desc,
            status: role.status,
            permissions,
        });
        setSaveButton(false);
        setRolePermission(permissions);
    };

    useEffect(async () => {
        const responseRoles = await API.role.get(setListLoading);
        const roles = responseRoles?.data?.map((role) => ({
            ...role,
            key: role.id,
        }));
        setRoles(roles);
        const resStatus = await API.enum.status();
        setEnStatus(resStatus?.data);
    }, []);

    const onFinish = async (values) => {
        const formValue = form.getFieldValue();
        let permission = formValue.moduleFunctions;
        const data = {
            ...values,
            status,
            roleModuleFunctions: permission
                .map((y) => y.fn)
                .flat()
                .map((x) => ({ moduleFunctionId: x.split(',')[0] })),
        };

        saveButton == true
            ? await API.role.post(data, setLoadSubmit)
            : await API.role.put(roleId, data, setLoadSubmit);

        setRolePermission([]);
        form.setFieldsValue({
            name: '',
            desc: '',
            status: 0,
        });

        const responseRoles = await API.role.get();
        const roles = responseRoles?.data?.map((role) => ({
            ...role,
            key: role.id,
        }));
        setRoles(roles);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="Consign-Form">
            <Title level={5}>Role</Title>
            <Row gutter={{ lg: 32, sm: 32, xs: 32 }}>
                <Col span={8}>
                    <List
                        className="list"
                        header={<div>Roles</div>}
                        loading={listLoading}
                        bordered
                        size="small"
                        dataSource={roles}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => getRoleDetails(item.id)}
                                key={item.id}
                            >
                                <Typography.Link>{item.name}</Typography.Link>
                            </List.Item>
                        )}
                    ></List>
                </Col>

                <Col span={15}>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        name="Role"
                        layout="vertical"
                        scrollToFirstError
                        onFinishFailed={onFinishFailed}
                    >
                        <Row className="roleGroup">
                            <Form.Item
                                name="name"
                                label="Name:"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a Name',
                                    },
                                ]}
                            >
                                <Input style={{ width: 420, height: 36 }} />
                            </Form.Item>
                            <Form.Item
                                name="desc"
                                label="Role Desc:"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please give Role Description',
                                    },
                                ]}
                            >
                                <TextArea style={{ width: 420, height: 36 }} />
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
                                    {' '}
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

                        <Permissions
                            form={form}
                            rolePermission={rolePermission}
                        />
                        <Button
                            loading={loadSubmit}
                            htmlType="submit"
                            type="primary"
                            style={{ marginTop: 24 }}
                        >
                            {saveButton ? 'Save' : 'Update'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Role;
