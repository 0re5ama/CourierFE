import {
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Form, Input, Modal, Table, Typography } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import API from '../../../services/ProductTracking/index';
export const baseURL = process.env.BASE_URL || 'https://localhost:7270/api';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    getOptions,
    type,
    handleSave,
    ...restProps
}) => {
    const inputRef = useRef(null);
    getOptions = getOptions || (() => []);
    const [options, setOptions] = useState([]);
    const form = useContext(EditableContext);
    useEffect(async () => {
        toggleEdit();
        let opt = await getOptions();
        setOptions(opt);
    }, []);
    const toggleEdit = () => {
        dataIndex &&
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: false,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {(type == 'input' && (
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                )) ||
                    (type == 'select' && (
                        <Select
                            disabled
                            bordered={false}
                            ref={inputRef}
                            options={options}
                            onPressEnter={save}
                            onBlur={save}
                        />
                    ))}
            </Form.Item>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const { Title } = Typography;

export default function Container() {
    const formRef = useRef();
    const [status, setStatus] = useState([]);
    const [ContainerType, setContainerType] = useState([]);
    const [action, setAction] = useState('A');
    const [consignment, setConsignment] = useState([]);
    const [selectedConsignment, setSelectedConsignment] = useState([]);
    const [checkpoint, setCheckpoint] = useState([]);
    const [sortedCheckpoint, setSortedCheckpoint] = useState([]);
    const { initialState, setInitialState } = useModel('@@initialState');
    const { currentUser } = initialState;
    const [ItemsInfo, setItemsInfo] = useState([]);
    const [modelAction, setModalAction] = useState(false);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [itemTableLoading, setItemLTableLoading] = useState(false);
    const [containerId, setContainerId] = useState();
    const [linkDisabled, setLinkDisabled] = useState(true);
    const token = localStorage.getItem('token');
    const authHeader = {
        Authorization: 'Bearer ' + token,
    };

    const viewItems = (id) => {
        const itemsinfo = consignment.filter((x) => x.key == id);
        const consignmentItems = itemsinfo
            .map((x) => x.consignmentItems)
            .flat();
        const items = consignmentItems?.map((x) => ({
            ...x,
            name: x.item.name,
        }));
        setItemsInfo(items);
        setModalAction(true);
    };

    const itemColumn = [
        {
            title: 'S.No.',
            width: '5%',
            render: (_, __, z) => z + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'itemName',
            type: 'input',
        },
        {
            title: 'CTN',
            dataIndex: 'quantity',
            key: 'quantity',
            type: 'num',
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            key: 'photo',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remark',
        },
    ];

    const Column = [
        {
            title: 'S.No.',
            width: '5%',
            render: (_, __, z) => z + 1,
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: 'ConsignmentNo',
            dataIndex: 'consignmentNo',
            key: 'consignmentNo',
            editable: false,
        },
        {
            title: 'ConsignmentDate',
            dataIndex: 'consignmentDate',
            key: 'consignmentDate',
            editable: false,
        },
        {
            title: 'Consignee',
            dataIndex: 'consignee',
            key: 'consignee',
            editable: false,
        },
        {
            title: 'PaymentStatus',
            dataIndex: 'paymentStatusName',
            key: 'paymentStatusName',
            editable: false,
        },
        {
            title: 'Cartoon Remarks',
            dataIndex: 'cartoonRemarks',
            key: 'cartoonRemarks',
            type: 'input',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => {
                return (
                    <span>
                        {consignment &&
                            (consignment?.length >= 0 ? (
                                <div>
                                    <Button
                                        type="primary"
                                        onClick={() => viewItems(record.id)}
                                        id="buttonView"
                                    >
                                        view items
                                    </Button>
                                </div>
                            ) : null)}
                    </span>
                );
            },
        },
    ];

    const consignmentColumn = [...Column.filter((x) => x.dataIndex != 'id')];
    const getContainerDetails = async (id) => {
        const resContainerDetail = await API.container.getById(id);
        formRef.current.setFieldsValue(resContainerDetail?.data);
        setSelectedConsignment(resContainerDetail?.data?.consignments);
    };

    const getConsignments = async () => {
        const resconsignment = await API.consignments.checkpointConsignments(
            setTableLoading
        );

        setConsignment(
            resconsignment?.data?.map((x) => ({
                ...x,
                key: x.id,
                consignmentDate: new Date(x.consignmentDate)
                    .toISOString()
                    .substring(0, 10),
            }))
        );
    };

    useEffect(async () => {
        const resStatus = await API.enum.containerStatus();
        setStatus(
            resStatus?.data?.map((x) => ({
                value: x.id,
                label: x.name,
            }))
        );
        await getConsignments();

        const resCheckpoint = await API.checkpoint.get();
        setCheckpoint(
            resCheckpoint?.data?.map((x) => ({
                value: x.id,
                label: x.name,
            }))
        );
        const formData = formRef?.current?.getFieldValue();
        const sortedcheckpoint = resCheckpoint?.data?.filter(
            (x) => x.id !== formData?.sourceId
        );

        setSortedCheckpoint(
            sortedcheckpoint?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
    }, []);

    const reset = async () => {
        await formRef.current?.resetFields();
        setSelectedConsignment([]);
        await getConsignments();
        setAction('A');
    };
    const submit = async (values) => {
        const data = {
            ...values,
            containerConsignments: selectedConsignment?.map((x) => ({
                consignmentId: x.id,
                cartoonRemarks: x.cartoonRemarks,
            })),
        };
        if (action == 'A') {
            const resSaveContainer = await API.container.post(data, loadSubmit);
            if (resSaveContainer?.isSuccess) {
                setContainerId(resSaveContainer?.data.id);
                setLinkDisabled(false);
            }
        } else await API.container.put(values.id, data, loadSubmit);
        await reset();
    };

    const getSortedCheckpoint = (id) => {
        const sortedCheckpoint = checkpoint.filter((x) => x.value !== id);
        setSortedCheckpoint(sortedCheckpoint);
        formRef.current.setFieldsValue({ destinationId: '' });
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedConsignment(selectedRows);
        },
    };
    const handleOk = () => {
        setModalAction(false);
    };
    const handleCancel = () => {
        setModalAction(false);
    };

    const handleSave = (row) => {
        const newData = [...selectedConsignment];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setSelectedConsignment(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = [...Column.filter((x) => x.dataIndex !== 'id')].map(
        (col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    getOptions: col.getOptions,
                    type: col.type,
                    handleSave,
                }),
            };
        }
    );

    const exportExcell = async () => {
        await API.Container.ExcellExport(id);
    };
    const requesturl = `${baseURL}/ExcellExport/${containerId}`;
    return (
        <>
            <ProCard key="page" direction="row" ghost gutter={16}>
                <ProCard key="form" colSpan={21}>
                    <Title level={5}>Container</Title>
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
                                    loading={loadSubmit}
                                    key="submit"
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
                                </Button>,

                                <a
                                    disabled={linkDisabled}
                                    href={requesturl}
                                    download
                                >
                                    Export Excell
                                </a>,
                            ],
                        }}
                        autoFocusFirstInput
                    >
                        <ProForm.Group>
                            <ProFormText name="id" hidden />

                            <ProFormText
                                width="md"
                                name="vechileNo"
                                required
                                label="Vechile No"
                                placeholder=""
                                rules={[
                                    {
                                        required: true,
                                        message: 'This is required',
                                    },
                                ]}
                            />
                            <ProFormText
                                width="md"
                                name="driverContactNo"
                                required
                                label="Driver ContactNo"
                                placeholder=""
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
                                options={checkpoint}
                                initialValue={currentUser?.checkpointId}
                                onChange={(id) => getSortedCheckpoint(id)}
                                width="md"
                                name="sourceId"
                                required
                                label="Source"
                                placeholder=""
                                rules={[
                                    {
                                        required: true,
                                        message: 'This is required',
                                    },
                                ]}
                            />
                            <ProFormSelect
                                width="md"
                                options={sortedCheckpoint}
                                name="destinationId"
                                required
                                label="Destination"
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
                                name="status"
                                label="Status"
                                width="md"
                                cacheForSwr
                                options={status}
                            />
                        </ProForm.Group>

                        <Title level={5}>Consignment</Title>

                        <Table
                            rowSelection={{ ...rowSelection }}
                            components={components}
                            rowClassName={() => 'editable-row'}
                            dataSource={consignment}
                            columns={columns}
                            loading={tableLoading}
                        />
                    </ProForm>
                    <Modal
                        title="Items"
                        visible={modelAction}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Table
                            dataSource={ItemsInfo}
                            columns={itemColumn}
                            loading={itemTableLoading}
                        />
                    </Modal>
                </ProCard>
            </ProCard>
        </>
    );
}
