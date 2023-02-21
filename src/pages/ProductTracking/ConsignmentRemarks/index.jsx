import { baseURL } from '@/services/api';
import {
    ProCard,
    ProForm,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Form, Input, Modal, Select, Table, Typography } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';

import API from '../../../services/ProductTracking/index';

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

const options = [
    {
        label: 'Is Received',
        value: 1,
    },
    { label: 'Is Transfer', value: 2 },
];

export default () => {
    const formRef = useRef();
    let location = useLocation();
    const [containerConsignment, setContainerConsignment] = useState([]);
    const { initialState, setInitialState } = useModel('@@initialState');
    const { currentUser } = initialState;
    const [checkpoint, setCheckpoint] = useState([]);
    const [SelectedRowKeys, setSelectedRowKeys] = useState([]);
    const [sourceId, setSourceId] = useState();
    const [transferOrRecived, setTransferOrRecived] = useState();
    const [nextDestinationAction, setNextDestinationAction] = useState(false);
    const [sortListedCheckpoint, setSortListedCheckpoint] = useState([]);
    const [action, setAction] = useState('R');
    const [ItemsInfo, setItemsInfo] = useState([]);
    const [modelAction, setModalAction] = useState(false);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [itemTableLoading, setItemTableLoading] = useState(false);

    const viewItems = async (id) => {
        const resConsignments = await API.consignment.getById(
            id,
            setItemTableLoading
        );
        const items = resConsignments?.data?.consignmentItems?.map((x) => ({
            ...x,
            itemName: x.item.name,
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
            title: 'ItemName',
            dataIndex: 'itemName',
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
            title: 'ConsignmentId',
            dataIndex: 'consignmentId',
            key: 'id',
            hidden: true,
        },

        {
            title: 'ConsignmentNo',
            dataIndex: 'consignmentNo',
            key: 'consignmentNo',
        },
        {
            title: 'ConsignmentDate',
            dataIndex: 'consignmentDate',
            key: 'consignmentDate',
        },
        {
            title: 'Consignee',
            dataIndex: 'consignee',
            key: 'consignee',
        },
        {
            title: 'PaymentStatus',
            dataIndex: 'payment',
            key: 'payment',
        },
        {
            title: 'Cartoon Remarks',
            dataIndex: 'cartoonRemarks',
            key: 'cartoonRemarks',
        },

        {
            title: 'Remarks',
            dataIndex: 'remarks',
            type: 'input',
            editable: transferOrRecived == 1 ? true : false,
        },

        {
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => {
                return (
                    <span>
                        {containerConsignment &&
                            (containerConsignment.length >= 0 ? (
                                <div>
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            viewItems(record.consignmentId)
                                        }
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

    const getContainerDetails = async (id) => {
        const resContainerDetail = await API.container.getById(
            id,
            setTableLoading
        );
        formRef.current.setFieldsValue(resContainerDetail?.data);
        setContainerConsignment(
            resContainerDetail?.data?.containerConsignments?.map((x) => ({
                key: x.id,
                consignmentNo: x?.consignment?.consignmentNo,
                consignee: x?.consignment?.consignee,
                consignmentDate: new Date(x.consignment.consignmentDate)
                    .toISOString()
                    .substring(0, 10),
                consignmentId: x?.consignmentId,
                payment: x?.consignment?.paymentStatusName,
                remarks: x?.remarks,
                cartoonRemarks: x?.cartoonRemarks,
            }))
        );
        setSourceId(resContainerDetail?.data?.sourceId);
    };

    const getCheckpoints = async () => {
        const resCheckpoints = await API.checkpoint.get();
        setCheckpoint(
            resCheckpoints?.data?.map((x) => ({
                value: x.id,
                label: x.name,
            }))
        );
        const formData = formRef.current.getFieldValue();
        const sortedcheckpoint = resCheckpoints?.data?.filter(
            (x) => x.id !== formData.sourceId
        );

        setSortListedCheckpoint(
            sortedcheckpoint?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
    };
    const reset = async () => {
        await formRef.current?.resetFields();
    };

    const submit = async (values) => {
        const receivedData = {
            ...values,
            isReceived: transferOrRecived == 1 ? true : false,
            containerConsignments: containerConsignment?.map((x) => ({
                ...x,
                id: x.key,
                recivedStatus: SelectedRowKeys.indexOf(x.id) > -1 ? 1 : 0,
            })),
        };
        const data = {
            id: values.id,
            vechileNo: values.vechileNo,
            driverContactNo: values.driverContactNo,
            sourceId: values.sourceId,
            destinationId: values.destinationId,
            isReceived: false,
            containerConsignments: containerConsignment?.map((x) => ({
                consignmentId: x.consignmentId,
            })),
        };
        if (action == 'R')
            await API.container.put(values.id, receivedData, setLoadSubmit);
        else await API.Container.transferContainer(data, setLoadSubmit);

        await reset();
        history.push('/ProductTracking/ContainerList');
    };

    useEffect(async () => {
        await getContainerDetails(location?.state?.id);
        await getCheckpoints();
    }, []);

    const handleSave = (row) => {
        const newData = [...containerConsignment];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setContainerConsignment(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = [
        ...Column.filter(
            (x) => x.dataIndex !== 'id' && x.dataIndex !== 'consignmentId'
        ),
    ].map((col) => {
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
    });
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const getTransferOrRecived = async (e) => {
        setTransferOrRecived(e.target.value);
        if (e.target.value !== 1) {
            setNextDestinationAction(true);
            formRef.current.setFieldsValue({
                sourceId: currentUser?.checkpointId,
                destinationId: null,
            });
            await getCheckpoints();
            setAction('T');
        }
        if (e.target.value == 1) {
            setAction('R');
            setNextDestinationAction(false);
        }
    };

    const handleOk = () => {
        setModalAction(false);
    };
    const handleCancel = () => {
        setModalAction(false);
    };
	const requesturl = `${baseURL}/ExcellExport/${location?.state?.id}`;

    return (
        <>
            <ProCard key="page" direction="row" ghost gutter={16}>
                <ProCard key="form" colSpan={16}>
                    <ProForm
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
                                    id="buttonSubmit"
                                    loading={loadSubmit}
                                    type="primary"
                                    key="submit"
                                    onClick={() => props.form?.submit?.()}
                                >
                                    {action == 'R' ? 'Recived' : 'Transfer'}
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
                                disabled
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
                                disabled
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
                            {nextDestinationAction == false ? (
                                <>
                                    <ProFormSelect
                                        options={checkpoint}
                                        disabled
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
                                        options={checkpoint}
                                        disabled
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
                                </>
                            ) : (
                                ''
                            )}
                        </ProForm.Group>
                        <ProFormRadio.Group
                            name="transferOrRecived "
                            options={options}
                            onChange={(value) => getTransferOrRecived(value)}
                            rules={[
                                {
                                    required: true,
                                    message: 'This is required',
                                },
                            ]}
                        />
                        {nextDestinationAction == true ? (
                            <>
                                <ProFormSelect
                                    options={checkpoint}
                                    initialValue={currentUser?.checkpointId}
                                    disabled
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
                                    options={sortListedCheckpoint}
                                    name="destinationId"
                                    label="Next Destination"
                                    width="md"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This is required',
                                        },
                                    ]}
                                />
                            </>
                        ) : (
                            ''
                        )}

                        <Title level={5}>Consignments</Title>
                        <a href={requesturl} download>
                            View in Excell
                        </a>
                        {transferOrRecived == 1 ? (
                            <Table
                                loading={tableLoading}
                                rowSelection={{ ...rowSelection }}
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                columns={columns}
                                dataSource={containerConsignment}
                            />
                        ) : (
                            <Table
                                loading={tableLoading}
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                columns={columns}
                                dataSource={containerConsignment}
                            />
                        )}
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
};
