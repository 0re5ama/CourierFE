import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, List, Transfer, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import API from '../../../services/ProductTracking/index';
import userAPI from '../../../services/Security/index';

const { Title } = Typography;

export default () => {
    const formRef = useRef();
    const [action, setAction] = useState('A');
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [checkpoints, setCheckpoints] = useState([]);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const userData = user.map((x) => ({
        key: x.id,
        title: x.name,
    }));

    const onChange = (nextTargetKeys) => {
        setSelectedUser(nextTargetKeys);
    };

    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const getCheckpoints = async () => {
        const resCheckpoints = await API.checkpoint.get(setListLoading);
        setCheckpoints(
            resCheckpoints?.data?.map((x) => ({
                ...x,
            }))
        );
    };

    const getUser = async () => {
        const resUser = await API.checkpoints.checkpointlessUser();
        setUser(
            resUser?.data?.map((x) => ({
                ...x,
            }))
        );
    };

    useEffect(async () => {
        await getCheckpoints();
        await getUser();
    }, []);

    const getCheckpointDetail = async (id) => {
        const resCheckpointDetail = await API.checkpoint.getById(id);
        formRef.current.setFieldsValue(resCheckpointDetail?.data);
        const resUser = await userAPI.user.get();
        const user = resUser.data?.filter(
            (x) => x.checkpointId == null || x.checkpointId == id
        );
        setUser(
            user?.map((x) => ({
                ...x,
            }))
        );
        setSelectedUser(resCheckpointDetail?.data?.users.map((x) => x.id));
        setAction('E');
    };
    const reset = async () => {
        await formRef.current?.resetFields();
        setSelectedUser([]);
        getUser();
        setAction('A');
    };

    const submit = async (values) => {
        const data = {
            ...values,
            users: selectedUser.map((x) => ({
                Id: x,
            })),
        };

        if (action == 'A') await API.checkpoint.post(data, setLoadSubmit);
        else await API.checkpoint.put(values.id, data, setLoadSubmit);
        await reset();
        await getCheckpoints();
    };

    return (
        <>
            <PageContainer title="Checkpoints">
                <ProCard split="vertical">
                    <ProCard colSpan="30%">
                        <List
                            header={<div>Checkpoints</div>}
                            size="small"
                            bordered
                            loading={listLoading}
                            id="checkpointShow"
                            onRow={(_) => {
                                return {
                                    onMouseEnter: () => {
                                        // console.log(_)
                                    },
                                    onClick: () => {
                                        // console.log(_)
                                    },
                                };
                            }}
                            rowKey="id"
                            dataSource={checkpoints}
                            showActions="hover"
                            showExtra="hover"
                            renderItem={(item) => (
                                <List.Item key={item.id}>
                                    <Typography.Link>
                                        {item.name}
                                    </Typography.Link>
                                    <div>
                                        <Button
                                            type="link"
                                            icon={<EditOutlined />}
                                            key="edit"
                                            onClick={() => {
                                                getCheckpointDetail(item.id);
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
                            layout="vertical"
                            id="checkpointGroup"
                            onFinish={submit}
                            formRef={formRef}
                            params={{ id: '100' }}
                            formKey="election-type-form"
                            dateFormatter={(value, valueType) => {
                                return value.format('YYYY/MM/DD HH:mm:ss');
                            }}
                            submitter={{
                                render: (props, dom) => [
                                    <Button
                                        type="primary"
                                        key="submit"
                                        loading={loadSubmit}
                                        id="buttonSubmit"
                                        onClick={() => props.form?.submit?.()}
                                    >
                                        {action == 'A' ? 'Submit' : 'Update'}
                                    </Button>,
                                    <Button
                                        type="default"
                                        key="submit"
                                        id="buttonReset"
                                        onClick={reset}
                                    >
                                        Reset
                                    </Button>
                                ],
                            }}
                            autoFocusFirstInput
                        >
                            <ProFormText name="id" hidden />

                            <ProFormText
                                name="name"
                                required
                                label="Name"
                                placeholder=""
                                rules={[
                                    {
                                        required: true,
                                        message: 'This is required',
                                    },
                                ]}
                            />
                            <ProFormText
                                name="address"
                                required
                                label="Address"
                                placeholder=""
                                rules={[
                                    {
                                        required: true,
                                        message: 'This is required',
                                    },
                                ]}
                            />
                            <div className='ant-form-item'>
                                <Transfer
                                    dataSource={userData}
                                    titles={['Available', 'Selected']}
                                    targetKeys={selectedUser}
                                    onChange={onChange}
                                    onSelectChange={onSelectChange}
                                    render={(item) => item.title}
                                />
                            </div>
                        </ProForm>
                    </ProCard>
                </ProCard>
            </PageContainer>
        </>
    );
};
