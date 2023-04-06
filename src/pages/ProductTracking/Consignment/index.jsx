import PrintComponent from '@/components/PrintComponent';
import { baseURL } from '@/services/api';
import { UploadOutlined } from '@ant-design/icons';
import {
    ProCard,
    ProForm,
    ProFormDatePicker,
    ProFormDependency,
    ProFormDigit,
    ProFormRadio,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    Typography,
    Upload,
} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import API from '../../../services/ProductTracking/index';
const converter = require('number-to-words');

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
    const token = localStorage.getItem('token');
    const authHeader = {
        Authorization: 'Bearer ' + token,
    };
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
                            id="item-selector"
                            showSearch
                            ref={inputRef}
                            onPressEnter={save}
                            onBlur={save}
                            options={options}
                        />
                    )) ||
                    (type == 'num' && (
                        <InputNumber
                            ref={inputRef}
                            onPressEnter={save}
                            onBlur={save}
                        />
                    )) ||
                    (type == 'photo' && (
                        <Upload
                            ref={inputRef}
                            onPressEnter={save}
                            onBlur={save}
                            listType="picture"
                            headers={authHeader}
                            action={baseURL + '/file'}
                            onChange={(info) => {
                                switch (info.file.status) {
                                    case 'done':
                                        form.setFieldsValue({
                                            photo: info.file.response.data,
                                        });

                                        break;
                                    case 'removed':
                                        // remove file from server
                                        break;
                                }
                            }}
                        >
                            {' '}
                            <Button icon={<UploadOutlined />}>
                                Upload Item Image
                            </Button>
                        </Upload>
                    ))}
            </Form.Item>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const { Title } = Typography;

export default ({ data }) => {
    const formRef = useRef();
    const [action, setAction] = useState('A');
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(1);
    const [cols, setCols] = useState([]);
    const [checkpoint, setCheckpoint] = useState([]);
    const [sortedCheckpoint, setSortedCheckpoint] = useState([]);
    const [total, setTotal] = useState(0);
    const [Package, setPackage] = useState([]);
    const { initialState, setInitialState } = useModel('@@initialState');
    const { currentUser } = initialState;
    const [consignmentNo, setConsignmentNo] = useState();
    const [model, setModel] = useState(false);
    const [consignmentData, setConsignmentData] = useState();
    const [disabled, setDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState([]);

    const updatePayStatus = (paymentStatus) => {
        setPaymentStatus(paymentStatus);
    };
    const handleDelete = (key) => {
        const newData = items.filter((item) => item.key !== key);
        setItems(newData);
    };

    const getItems = async () => {
        const resItems = await API.item.get();
        return resItems?.data?.map((x) => ({
            label: x.name,
            value: x.id,
        }));
    };
    const Column = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: 'ItemName',
            dataIndex: 'itemName',
            key: 'itemName',
            type: 'input',
            editable: !disabled,
        },
        {
            title: 'CTN',
            dataIndex: 'quantity',
            key: 'quantity',
            type: 'num',

            editable: !disabled,
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            render: (record) => (
                <img src={`${baseURL}/file/${record}`} width={50} />
            ),
            key: 'photo',
            type: 'photo',
            editable: !disabled,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            type: 'input',
            editable: !disabled,
        },
    ];
    const handleAdd = () => {
        const itemsData = {
            key: count,
            itemId: '',
            quantity: 0,
            photo: '',
            remarks: '',
        };

        setItems([...items, itemsData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        const newData = [...items];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setItems(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = [
        {
            title: 'S.No.',
            width: '5%',
            render: (_, __, z) => z + 1,
        },
        ...Column.filter((x) => x.dataIndex !== 'id'),
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                return (
                    <span>
                        {items.length >= 0 && !disabled ? (
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => handleDelete(record.key)}
                            >
                                <a>Delete</a>
                            </Popconfirm>
                        ) : null}
                    </span>
                );
            },
        },
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

    useEffect(async () => {
        const resCheckpoint = await API.checkpoint.get();
        setCheckpoint(
            resCheckpoint?.data?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
        const formData = formRef?.current?.getFieldValue();
        const sortedcheckpoint = resCheckpoint?.data?.filter(
            (x) => x.id !== formData?.startingStationId
        );

        setSortedCheckpoint(
            sortedcheckpoint?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
        const resPackage = await API.Package.get();
        setPackage(
            resPackage?.data?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );

        const resPaymentStatus = await API.enum.paymentStatus();
        console.log(resPaymentStatus);
        setPaymentStatuses(
            resPaymentStatus?.data?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
        data && formRef.current.setFieldsValue(data && data);
        setItems(data ? data?.consignmentItems : []);
        data && setDisabled(true);
        data && setAction('E');
    }, [data]);

    const reset = async () => {
        await formRef.current?.resetFields();
        setAction('A');
    };

    const submit = async (values) => {
        const data = {
            ...values,
            currentlocationId: values.startingStationId,
            consignmentItems: items,
            consignmentStatus: 1,
        };
        if (action == 'A') {
            const resConsignment = await API.consignment.post(
                data,
                setLoadSubmit
            );
            if (resConsignment.isSuccess) {
                const resConsignmentDetail = await API.consignment.getById(
                    resConsignment?.data?.id
                );

                formRef.current.setFieldsValue({
                    consignmentNo: resConsignment?.data?.consignmentNo,
                });

                setConsignmentData(resConsignmentDetail?.data);
                setButtonDisabled(false);
                modelOpen();
            }
            // await reset();
            setItems([]);
        }
    };

    const handleOk = () => {
        setModel(false);
    };

    const handleCancel = () => {
        setModel(false);
    };

    const getSortedCheckpoint = (id) => {
        const sortedCheckpoint = checkpoint.filter((x) => x.value !== id);
        setSortedCheckpoint(sortedCheckpoint);
        formRef.current.setFieldsValue({ destinationId: '' });
    };

    const modelOpen = () => {
        setModel(true);
    };

    return (
        <ProCard ghost>
            <ProForm
                onFinish={submit}
                formRef={formRef}
                params={{ id: '100' }}
                formKey="election-type-form"
                dateFormatter={(value, valueType) => {
                    value.locale('en');
                    return value.format('YYYY-MM-DD');
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
                            {action == 'A' ? 'Submit' : ''}
                        </Button>,
                        <Button
                            type="default"
                            key="reset"
                            id="buttonReset"
                            onClick={reset}
                        >
                            {action == 'A' ? 'Reset' : ''}
                        </Button>,

                        <Button
                            type="default"
                            key="print"
                            onClick={modelOpen}
                            id="buttonSubmit"
                            disabled={buttonDisabled}
                        >
                            {action == 'A' ? 'Print preview' : ''}
                        </Button>,
                    ],
                }}
                autoFocusFirstInput
            >
                <div className="Consign-Form">
                    <h4 id="mainTitle" className="ant-typography">
                        Consignment Entry
                    </h4>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col border-right-none" span={3}>
                            托运号：Y
                            <br />
                            CONSIGNMENT NO:
                        </Col>
                        <Col className="Consign-Col" span={9}>
                            <ProFormTextArea
                                disabled={true}
                                className="textArea"
                                name="consignmentNo"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            起运站
                            <br />
                            STARTING STATION:
                        </Col>
                        <Col className="Consign-Col border-right-none" span={9}>
                            <ProFormSelect
                                disabled={true}
                                options={checkpoint}
                                initialValue={currentUser?.checkpointId}
                                onChange={(id) => getSortedCheckpoint(id)}
                                placeholder="please Select"
                                name="startingStationId"
                                fieldProps={{
                                    bordered: false,
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col border-right-none" span={3}>
                            托运日期
                            <br />
                            CONSIGNMENT DATE:
                        </Col>
                        <Col className="Consign-Col" span={9}>
                            <ProFormDatePicker
                                disabled={disabled}
                                name="consignmentDate"
                                initialValue={new Date()}
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            到达站
                            <br />
                            DESTINATION:
                        </Col>
                        <Col className="Consign-Col border-right-none" span={9}>
                            <ProFormSelect
                                disabled={disabled}
                                options={sortedCheckpoint}
                                name="destinationId"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col border-right-none" span={3}>
                            托运日期
                            <br />
                            CONSIGNEE MARK:
                        </Col>
                        <Col className="Consign-Col" span={9}>
                            <ProFormTextArea
                                disabled={disabled}
                                name="consignee"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            联系电话
                            <br />
                            TELEPHONE:
                        </Col>
                        <Col className="Consign-Col border-right-none" span={9}>
                            <ProFormTextArea
                                disabled={disabled}
                                name="telephone"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            货物名称 <br /> DESCRIPTION
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            包装 <br /> PACKAGE
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            件数 <br /> QUANTITY
                        </Col>
                        {/*
<Col className="Consign-Col" span={2}>
<Row className="Consign-Title">
箱号
</Row>
<Row className="Consign-Title">CTN NO</Row>
</Col>
						*/}
                        <Col className="Consign-Col" span={2}>
                            包装费 <br /> PACKING FEE
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            重量 <br /> WEIGHT (KG)
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            包装费 <br /> VOLUME (CBM)
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            税款 <br /> TAX
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            运费 <br /> FREIGHT
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            预付款 <br /> ADVANCE
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            预付款 <br /> BILL CHARGE
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <ProFormTextArea
                                disabled={disabled}
                                name="description"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <ProFormSelect
                                disabled={disabled}
                                options={Package}
                                name="packageId"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder="Select"
                            />
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <ProFormDigit
                                disabled={disabled}
                                name="quantity"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        {/*
<Col className="Consign-Col" span={2}>
<ProFormTextArea
disabled={disabled}
name="ctnNo"
fieldProps={{
bordered: false,
}}
placeholder=""
/>
</Col>
						*/}
                        <Col className="Consign-Col" span={2}>
                            <ProFormDigit
                                disabled={disabled}
                                name="packingFee"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <ProFormDigit
                                disabled={disabled}
                                name="weight"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <ProFormDigit
                                name="volume"
                                disabled={disabled}
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <ProFormDigit
                                disabled={disabled}
                                name="tax"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <ProFormDigit
                                disabled={disabled}
                                name="freight"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <ProFormDigit
                                disabled={disabled}
                                name="advance"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            <ProFormDigit
                                disabled={disabled}
                                name="billCharge"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            价值 <br /> VALUE
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            保险 <br /> INSURANCE
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            代垫款 <br /> LOCAL FREIGHT
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            付款方式 <br /> PAYMENT METHOD
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            FREIGHT ON DELIVERY
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            合计金额
                        </Col>
                        <Col className="Consign-Col" span={4}>
                            <ProFormDependency
                                name={[
                                    'packingFee',
                                    'tax',
                                    'freight',
                                    'insurance',
                                    'billCharge',
                                    'localFreight',
                                    'advance',
                                ]}
                            >
                                {({
                                    packingFee,
                                    tax,
                                    freight,
                                    insurance,
                                    localFreight,
                                    billCharge,
                                    advance,
                                }) => (
                                    <>
                                        <span>
                                            {converter.toWords(
                                                (+packingFee || 0) +
                                                    (+tax || 0) +
                                                    (+freight || 0) +
                                                    (+insurance || 0) +
                                                    (+billCharge || 0) +
                                                    (+localFreight || 0)
                                            )}
                                        </span>
                                    </>
                                )}
                            </ProFormDependency>
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            贸易方式 <br /> TRADE MODE
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <ProFormDigit
                                disabled={disabled}
                                name="value"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <ProFormDigit
                                disabled={disabled}
                                name="insurance"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <ProFormDigit
                                disabled={disabled}
                                name="localFreight"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <ProFormRadio.Group
                                name="paymentMethod"
                                options={[
                                    {
                                        label: '现付款',
                                        value: 1,
                                    },
                                    {
                                        label: '提付款',
                                        value: 2,
                                    },
                                ]}
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <ProFormDependency
                                name={[
                                    'packingFee',
                                    'tax',
                                    'freight',
                                    'insurance',
                                    'billCharge',
                                    'localFreight',
                                    'advance',
                                ]}
                            >
                                {({
                                    packingFee,
                                    tax,
                                    freight,
                                    insurance,
                                    localFreight,
                                    billCharge,
                                    advance,
                                }) => (
                                    <>
                                        <ProFormDigit
                                            disabled={true}
                                            name="freightOnDelivery"
                                            fieldProps={{
                                                bordered: false,
                                            }}
                                            placeholder=""
                                            value={
                                                (+packingFee || 0) +
                                                (+tax || 0) +
                                                (+freight || 0) +
                                                (+insurance || 0) +
                                                (+billCharge || 0) +
                                                (+localFreight || 0) -
                                                (+advance || 0)
                                            }
                                        />
                                    </>
                                )}
                            </ProFormDependency>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            TOTAL AMOUNT
                        </Col>
                        <Col className="Consign-Col" span={4}>
                            <Row className="Consign-Field">
                                <ProFormDependency
                                    name={[
                                        'packingFee',
                                        'tax',
                                        'freight',
                                        'billCharge',
                                        'insurance',
                                        'localFreight',
                                    ]}
                                >
                                    {({
                                        packingFee,
                                        tax,
                                        freight,
                                        billCharge,
                                        insurance,
                                        localFreight,
                                    }) => (
                                        <>
                                            <span>
                                                {(+packingFee || 0) +
                                                    (+tax || 0) +
                                                    (+freight || 0) +
                                                    (+insurance || 0) +
                                                    (+billCharge || 0) +
                                                    (+localFreight || 0)}
                                            </span>
                                            {/*<ProFormDigit
                                                disabled={true}
                                                name="totalAmount"
                                                fieldProps={{
                                                    bordered: false,
                                                }}
                                                placeholder=""
                                                value={
                                                    (+packingFee || 0) +
                                                    (+tax || 0) +
                                                    (+freight || 0) +
                                                    (+insurance || 0) +
                                                    (+billCharge || 0) +
                                                    (+localFreight || 0)
                                                }
											/>*/}
                                        </>
                                    )}
                                </ProFormDependency>
                            </Row>
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            <ProFormTextArea
                                disabled={disabled}
                                name="tradeMode"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                    </Row>
                    <Row className="Consign-Row border-bottom">
                        <Col className="Consign-Col" span={3}>
                            备注 <br /> REMARKS
                        </Col>
                        <Col className="Consign-Col" span={14}>
                            <ProFormTextArea
                                disabled={disabled}
                                name="remarks"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            收货人签字 <br /> SIGNATURE
                        </Col>
                        <Col className="Consign-Col border-right-none" span={4}>
                            <ProFormTextArea
                                disabled={disabled}
                                name="signature"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                    </Row>
                </div>

                {data && data ? (
                    <>
                        <Typography>PaidAmount:</Typography>
                        {data?.paymentAmount}
                        <Typography>Paid Status:</Typography>
                        {data?.paymentStatusName}
                    </>
                ) : (
                    <>
                        {/* <ProFormDigit
name="paymentAmount"
label="PaidAmount"
placeholder=""
width="md"
/> */}
                        <ProFormSelect
                            options={paymentStatuses}
                            width="md"
                            name="paymentStatus"
                            value={paymentStatus}
                            readonly={true}
                            label="Status"
                        />
                        <ProFormDependency
                            name={[
                                'packingFee',
                                'tax',
                                'freight',
                                'insurance',
                                'billCharge',
                                'localFreight',
                                'advance',
                            ]}
                        >
                            {({
                                packingFee,
                                tax,
                                freight,
                                insurance,
                                localFreight,
                                billCharge,
                                advance,
                            }) => {
                                const paymentStatus =
                                    (+packingFee || 0) +
                                        (+tax || 0) +
                                        (+freight || 0) +
                                        (+insurance || 0) +
                                        (+billCharge || 0) -
                                        (+advance || 0) +
                                        (+localFreight || 0) ==
                                    0
                                        ? 0
                                        : 1;
                                updatePayStatus(paymentStatus);
                                return (
                                    <>
                                        {/*<Title level={4}>
                                        {(+packingFee || 0) +
                                            (+tax || 0) +
                                            (+freight || 0) +
                                            (+insurance || 0) +
                                            (+billCharge || 0) +
                                            (+localFreight || 0) ==
                                        0
                                            ? 'Paid'
                                            : 'Not Paid'}
										</Title>*/}
                                    </>
                                );
                            }}
                        </ProFormDependency>
                    </>
                )}
                <Title
                    style={{
                        marginBottom: 16,
                    }}
                    level={5}
                >
                    Items
                </Title>
                <Button
                    onClick={handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                    id="buttonAdd"
                >
                    Add
                </Button>

                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={items}
                    columns={columns}
                    style={{
                        marginBottom: 32,
                    }}
                />
                <Modal
                    visible={model}
                    width="100%"
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <PrintComponent data={consignmentData} />
                </Modal>
            </ProForm>
        </ProCard>
    );
};
