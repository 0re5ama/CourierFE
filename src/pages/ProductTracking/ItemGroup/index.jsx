import {
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, List, Typography } from 'antd';
export const baseURL = process.env.BASE_URL || 'https://localhost:7270/api';

import { useEffect, useRef, useState } from 'react';
import API from '../../../services/ProductTracking/index';

const { Title } = Typography;

export default () => {
    const formRef = useRef();
    const [action, setAction] = useState('A');
    const [itemGroups, setItemGroup] = useState([]);
    const [status, setStatus] = useState([]);
    const [listloading, setListLoading] = useState(false);
    const [loadSubmit, setLoadSubmit] = useState(false);

    const getItemGroups = async () => {
        const resItemGroups = await API.itemGroup.get(setListLoading);
        setItemGroup(
            resItemGroups?.data?.map((x) => ({
                ...x,
            }))
        );
    };

    const getItemGroupDetail = async (id) => {
        const resItemGroupDetail = await API.itemGroup.getById(
            id,
            setFormLoading
        );
        formRef.current.setFieldsValue(resItemGroupDetail?.data);
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
        action == 'A'
            ? await API.itemGroup.post(data, setLoadSubmit)
            : await API.itemGroup.put(values.id, data, setLoadSubmit);

        await getItemGroups();
        await reset();
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
        await getItemGroups();
        await getStatus();
    }, []);

    return (
        <>
            <ProCard key="page" direction="row" ghost gutter={16}>
                <ProCard key="list" colspan={12} ghost>
                    <List
                        size="large"
                        loading={listloading}
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
                        header={<div>Item Groups</div>}
                        dataSource={itemGroups}
                        bordered
                        showActions="hover"
                        showExtra="hover"
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <Typography.Link>{item.name}</Typography.Link>
                                <a
                                    key="edit"
                                    onClick={() => {
                                        getItemGroupDetail(item.id);
                                    }}
                                >
                                    Edit
                                </a>
                            </List.Item>
                        )}
                    />
                </ProCard>
                <ProCard key="form" colSpan={16}>
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
                                    type="primary"
                                    key="submit"
                                    loading={loadSubmit}
                                    onClick={() => props.form?.submit?.()}
                                >
                                    {action == 'A' ? 'Submit' : 'Update'}
                                </Button>,
                                <Button
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
