import {
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, List, Popconfirm, Spin, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import API from '../../../services/ProductTracking/index';
export const baseURL = process.env.BASE_URL || 'https://localhost:7270/api';

const { Title } = Typography;

export default () => {
    const formRef = useRef();
    const [action, setAction] = useState('A');
    const [items, setItems] = useState([]);
    const [itemGroups, setItemGroup] = useState([]);
    const [status, setStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [id, setId] = useState();

    const getGroupItems = async (id) => {
        setId(id);
        const resItems = await API.groupsItem.groupsItems(id, setListLoading);
        setItems(
            resItems?.data?.map((x) => ({
                ...x,
            }))
        );
    };
    const getItemGroups = async () => {
        const resItemGroups = await API.itemGroup.get();
        setItemGroup(
            resItemGroups?.data?.map((x) => ({
                ...x,
                label: x.name,
                value: x.id,
            }))
        );
    };

    const getItemDetail = async (id) => {
        const resItemGroupDetail = await API.item.getById(id);
        formRef.current.setFieldsValue(resItemGroupDetail.data);
        setAction('E');
    };
    const reset = async () => {
        await formRef.current?.resetFields();
        setAction('A');
    };

    const del = async (id) => {
        const deleteItem = await API.itemGroup.delete(id, setListLoading);
        await getGroupItems(id);
    };

    const submit = async (values) => {
        const data = {
            ...values,
            items: items,
        };
        if (action == 'A') await API.item.post(data, setLoadSubmit);
        else await API.item.put(values.id, data, setLoadSubmit);

        await reset();
        await getGroupItems(id);
    };

    useEffect(async () => {
        await getItemGroups();
        const resStatus = await API.enum.status();
        setStatus(
            resStatus?.data?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
        setLoading(false);
    }, []);

    return (
        <>
            {loading ? (
                <Spin />
            ) : (
                <>
                    <ProCard key="page" direction="row" ghost gutter={16}>
                        <ProCard key="list" colspan={8} ghost>
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
                                header={<div>Items</div>}
                                dataSource={items}
                                bordered
                                loading={listLoading}
                                showActions="hover"
                                showExtra="hover"
                                renderItem={(item) => (
                                    <List.Item key={item.id}>
                                        <Typography.Link>
                                            {item.name}
                                        </Typography.Link>
                                        <a
                                            key="edit"
                                            onClick={() => {
                                                getItemDetail(item.id);
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
                                            id="buttonSubmit"
                                            type="primary"
                                            loading={loadSubmit}
                                            key="submit"
                                            onClick={() =>
                                                props.form?.submit?.()
                                            }
                                        >
                                            {action == 'A'
                                                ? 'Submit'
                                                : 'Update'}
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
                                <ProFormText name="id" hidden />
                                <ProFormSelect
                                    options={itemGroups}
                                    width="md"
                                    name="itemGroupId"
                                    required
                                    label="Item Group"
                                    onChange={(id) => getGroupItems(id)}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This is required',
                                        },
                                    ]}
                                />

                                <ProFormText
                                    width="md"
                                    name="name"
                                    required
                                    placeholder=""
                                    label="Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This is required',
                                        },
                                    ]}
                                />
                                <ProFormText
                                    width="md"
                                    name="nameShort"
                                    required
                                    placeholder=""
                                    label="Name Short"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This is required',
                                        },
                                    ]}
                                />

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
                            </ProForm>
                        </ProCard>
                    </ProCard>
                </>
            )}
        </>
    );
};
