import { baseURL } from '@/services/api';
import { PlusOutlined } from '@ant-design/icons';
import {
    ProCard,
    ProForm,
    ProFormCheckbox,
    ProFormSelect,
    ProFormText,
    ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, List, Popconfirm, Typography } from 'antd';
import API from '../../../services/Security';

import { useEffect, useRef, useState } from 'react';

export default () => {
    const [action, setAction] = useState('A');
    const [offices, setOffices] = useState([]);
    const [officeType, setOfficeType] = useState([]);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const formRef = useRef();

    const getOffices = async () => {
        const resOffices = await API.office.get(setListLoading);
        setOffices(
            resOffices?.data?.map((x) => ({
                ...x,
                value: x.id,
                label: x.nameEng,
                logoURL: baseURL + '/file/' + x.image,
            }))
        );
    };
    const submit = async (values) => {
        const data = {
            ...values,
        };
        if (action == 'A') await API.office.post(data, loadSubmit);
        else await API.office.put(values.id, values, loadSubmit);
        await reset();
    };
    const reset = async () => {
        await formRef.current?.resetFields();
        setAction('A');
    };
    const getOffice = async (id) => {
        const resOffice = await API.office.getById(id);
        formRef.current?.setFieldsValue(resOffice.data);
        setAction('E');
    };

    const del = async (id) => {
        await API.office.delete(id, setListLoading);
        await getOffices();
    };

    useEffect(async () => {
        await getOffices();
        const resOfficeType = await API.enum.officeType();
        setOfficeType(
            resOfficeType.data?.map((x) => ({
                ...x,
                label: x.name,
                value: x.id,
            }))
        );
    }, []);

    return (
        <ProCard key="page" direction="row" ghost gutter={16}>
            <ProCard key="list" colSpan={8} ghost gutter={16}>
                <List
                    size="large"
                    onRow={(_) => {
                        return {
                            onMouseEnter: () => {
                                // console.log(_);
                            },
                            onClick: () => {
                                // console.log(_);
                            },
                        };
                    }}
                    rowKey="id"
                    header={<div>Offices</div>}
                    dataSource={offices}
                    bordered
                    loading={listLoading}
                    showActions="hover"
                    showExtra="hover"
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <Typography.Link>{item.nameEng}</Typography.Link>
                            <a
                                key="edit"
                                onClick={() => {
                                    getOffice(item.id);
                                }}
                            >
                                Edit
                            </a>

                            <Popconfirm
                                key="popconfirm"
                                title="Are you sure?"
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
                    formRef={formRef}
                    onFinish={submit}
                    params={{ id: '100' }}
                    formKey="office_form"
                    submitter={{
                        render: (props, dom) => [
                            <Button
                                loading={loadSubmit}
                                type="primary"
                                key="submit"
                                id="buttonSubmit"
                                onClick={() => props.form?.submit?.()}
                            >
                                {' '}
                                {action == 'A' ? 'Submit' : 'Update'}
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
                    autoFocusFirstInput
                >
                    <ProForm.Group>
                        <ProFormText name="id" hidden />
                        <ProFormText
                            width="md"
                            name="nameEng"
                            required
                            label="Name"
                            placeholder="Please enter the name in English"
                            rules={[
                                { required: true, message: 'This is required' },
                            ]}
                        />

                        <ProFormText
                            width="md"
                            name="nameNep"
                            required
                            label="नाम"
                            placeholder="नाम"
                            rules={[
                                { required: true, message: 'This is required' },
                            ]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="nameShort"
                            required
                            label="Name Short"
                            placeholder="Name Short"
                            rules={[
                                { required: true, message: 'This is required' },
                            ]}
                        />
                        <ProFormText
                            width="md"
                            name="officeCode"
                            required
                            label="Office Code"
                            placeholder="Office Code"
                            rules={[
                                { required: true, message: 'This is required' },
                            ]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormCheckbox.Group
                            name="isParrent"
                            width="md"
                            layout=" vertical "
                            label="Is Parent"
                            options={['IsParent']}
                        />
                        <ProFormSelect
                            required
                            options={offices}
                            width="md"
                            name="parrentOffice"
                            cacheForSwr
                            label="Parent Office"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormSelect
                            options={officeType}
                            required
                            width="md"
                            cacheForSwr
                            name="officeType"
                            label="Type"
                        />
                        <ProFormText
                            name="address"
                            label="Address"
                            width="md"
                            placeholder="Address"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            name="contact"
                            label="Contacts"
                            width="md"
                            placeholder="Contacts"
                        />
                        <ProFormText
                            name="website"
                            label="Website"
                            width="md"
                            placeholder="WebsiteURL"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormUploadButton
                            label="Logo"
                            title="Upload"
                            action={baseURL + '/file'}
                            onChange={(info) => {
                                switch (info.file.status) {
                                    case 'done':
                                        formRef.current.setFieldsValue({
                                            logo: info.file.response.data,
                                        });
                                        break;
                                    case 'removed':
                                        // remove file from server
                                        break;
                                }
                            }}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </ProFormUploadButton>
                        <ProFormText name="logo" hidden />
                    </ProForm.Group>
                </ProForm>
            </ProCard>
        </ProCard>
    );
};
