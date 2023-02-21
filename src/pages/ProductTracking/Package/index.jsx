import {
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, List, Popconfirm, Typography } from 'antd';

import { useEffect, useRef, useState } from 'react';
import API from '../../../services/ProductTracking/index';

const { Title } = Typography;

export default () => {
    const formRef = useRef();
    const [action, setAction] = useState('A');
    const [packages, setPackage] = useState([]);
    const [status, setStatus] = useState([]);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const getpackage = async () => {
        const respackage = await API.Package.get(setListLoading);
        setPackage(
            respackage.data?.map((x) => ({
                ...x,
            }))
        );
    };

    const getPackageDetail = async (id) => {
        const resPackageDetail = await API.Package.getById(id);
        formRef.current.setFieldsValue(resPackageDetail?.data);
        setAction('E');
    };
    const reset = async () => {
        await formRef.current?.resetFields();
        setItems([]);
        setAction('A');
    };

    const submit = async (values) => {
        const data = {
            ...values,
        };
        if (action == 'A') await API.Package.post(data, loadSubmit);
        else await API.Package.put(values.id, data, loadSubmit);
        await getpackage();
        await reset();
    };
    const del = async (id) => {
        await API.Package.delete(id, setListLoading);
        await getpackage();
    };

    const getStatus = async () => {
        const resStatus = await API.enum.status();

        setStatus(
            resStatus?.data?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
    };

    useEffect(async () => {
        await getpackage();
        await getStatus();
    }, []);

    return (
        <>
            <ProCard key="page" direction="row" ghost gutter={16}>
                <ProCard key="list" ghost>
                    <List
                        size="large"
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
                        header={<div>packages</div>}
                        dataSource={packages}
                        bordered
                        loading={listLoading}
                        showActions="hover"
                        showExtra="hover"
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <Typography.Link>{item.name}</Typography.Link>
                                <a
                                    key="edit"
                                    onClick={() => {
                                        getPackageDetail(item.id);
                                    }}
                                >
                                    Edit
                                </a>
                                <Popconfirm
                                    key="popconfirm"
                                    title="Are You Sure?"
                                    onConfirm={() => {
                                        del(item.id);
                                    }}
                                >
                                    <a>Delete</a>
                                </Popconfirm>
                            </List.Item>
                        )}
                    />
                </ProCard>
                <ProCard key="form">
                    <ProForm
                        onFinish={submit}
                        formRef={formRef}
                        params={{ id: '100' }}
                        formKey="election-type-form"
                        dateFormatter={(value, valueType) => {
                            console.log('---->', value, valueType);
                            return value.format('YYYY/MM/DD HH:mm:ss');
                        }}
                        submitter={{
                            render: (props, dom) => [
                                <Button
                                    id="buttonSubmit"
                                    type="primary"
                                    key="submit"
                                    loading={loadSubmit}
                                    onClick={() => props.form?.submit?.()}
                                >
                                    {action == 'A' ? 'Submit' : 'Update'}
                                </Button>,
                                <Button
                                    id="buttonReset"
                                    type="default"
                                    key="submit"
                                    onClick={reset}
                                >
                                    Reset
                                </Button>,
                            ],
                        }}
                        autoFocusFirstInput
                    >
                        <ProForm.Group>
                            <ProFormText name="id" hidden />
                            <ProFormText
                                width="md"
                                name="name"
                                placeholder=""
                                required
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This is required',
                                    },
                                ]}
                            />
                        </ProForm.Group>
                        <ProForm.Group>
                            <ProFormSelect
                                options={status}
                                width="md"
                                name="status"
                                required
                                label="Status"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This is required',
                                    },
                                ]}
                            />
                        </ProForm.Group>
                    </ProForm>
                </ProCard>
            </ProCard>
        </>
    );
};
