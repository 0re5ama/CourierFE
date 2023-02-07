import PrintComponent from '@/components/PrintComponent';
import { UploadOutlined } from '@ant-design/icons';
import {
    ProForm,
    ProFormDatePicker,
    ProFormDigit,
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

export const baseURL = process.env.BASE_URL || 'https://localhost:7270/api';
const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    listType: 'picture',
    beforeUpload(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = document.createElement('img');
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    ctx.fillStyle = 'red';
                    ctx.textBaseline = 'middle';
                    ctx.font = '33px Arial';
                    ctx.fillText('Ant Design', 20, 20);
                    canvas.toBlob((result) => resolve(result));
                };
            };
        });
    },
};

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
                            {...props}
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
    const [paymentStatus, setPaymentStatus] = useState([]);

    const handleDelete = (key) => {
        const newData = items.filter((item) => item.key !== key);
        setItems(newData);
    };

    const getItems = async () => {
        const resItems = await API.item.get();
        console.log(resItems);
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
            dataIndex: 'itemId',
            key: 'itemId',
            getOptions: getItems,
            type: 'select',
            editable: true,
        },
        {
            title: 'CTN',
            dataIndex: 'quantity',
            key: 'quantity',
            type: 'num',

            editable: disabled == true ? false : true,
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            key: 'photo',
            type: 'photo',
            editable: disabled == true ? false : true,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            type: 'input',
            editable: disabled == true ? false : true,
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
                        {items.length >= 0 ? (
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
        setPaymentStatus(
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

    const onFreightChange = () => {
        const formData = formRef.current.getFieldValue();
        formRef.current.setFieldsValue({
            totalAmount: total + formData.freight,
        });
        setTotal(total + formData.freight);
    };
    const onInsuranceChange = () => {
        const formData = formRef.current.getFieldValue();
        formRef.current.setFieldsValue({
            totalAmount: total + formData.insurance,
        });
        setTotal(total + formData.insurance);
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

                setConsignmentData(resConsignmentDetail?.data);
                setButtonDisabled(false);
            }
            await reset();
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
        <>
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
                            style={{
                                marginLeft: 64,
                            }}
                            onClick={() => props.form?.submit?.()}
                        >
                            {action == 'A' ? 'Submit' : ''}
                        </Button>,
                        <Button
                            type="default"
                            key="submit"
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
                    <h4 id="mainTitle" class="ant-typography">
                        Consignment Entry
                    </h4>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                托运号：Y
                            </Row>
                            <Row className="Consign-Title">CONSIGNMENT NO:</Row>
                        </Col>
                        <Col className="Consign-Col" span={9}>
                            <ProFormTextArea
                                disabled={disabled}
                                className="textArea"
                                name="consignmentNo"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                起运站
                            </Row>
                            <Row className="Consign-Title">
                                STARTING STATION:
                            </Row>
                        </Col>
                        <Col className="Consign-Col border-right-none" span={9}>
                            <ProFormSelect
                                disabled={disabled}
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
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                托运日期
                            </Row>
                            <Row className="Consign-Title">
                                CONSIGNMENT DATE:
                            </Row>
                        </Col>
                        <Col className="Consign-Col" span={9}>
                            <ProFormDatePicker
                                disabled={disabled}
                                name="consignmentDate"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                到达站
                            </Row>
                            <Row className="Consign-Title">DESTINATION:</Row>
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
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                托运日期
                            </Row>
                            <Row className="Consign-Title">CONSIGNEE MARK:</Row>
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
                            <Row className="border-bottom Consign-Title">
                                联系电话
                            </Row>
                            <Row className="Consign-Title">TELEPHONE:</Row>
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
                            <Row className="border-bottom Consign-Title">
                                货物名称
                            </Row>
                            <Row className="Consign-Title">DESCRIPTION</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Consign-Title">
                                包装
                            </Row>
                            <Row className="Consign-Title">PACKAGE</Row>
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                件数
                            </Row>
                            <Row className="Consign-Title">QUANTITY</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Consign-Title">
                                箱号
                            </Row>
                            <Row className="Consign-Title">CTN NO</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Consign-Title">
                                包装费
                            </Row>
                            <Row className="Consign-Title">EXPENSE</Row>
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                包装费
                            </Row>
                            <Row className="Consign-Title">CBM</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Consign-Title">
                                重量
                            </Row>
                            <Row className="Consign-Title">WEIGHT</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Consign-Title">
                                税款
                            </Row>
                            <Row className="Consign-Title">TAX</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Consign-Title">
                                运费
                            </Row>
                            <Row className="Consign-Title">FREIGHT</Row>
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            <Row className="border-bottom Consign-Title">
                                预付款
                            </Row>
                            <Row className="Consign-Title">ADVANCE</Row>
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
                                placeholder="Please Select"
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <ProFormDigit
                                disabled={disabled}
                                name="quantity"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
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
                        <Col className="Consign-Col" span={2}>
                            <ProFormDigit
                                disabled={disabled}
                                name="expense"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <ProFormTextArea
                                name="cBM"
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
                                name="weight"
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
                                onBlur={onFreightChange}
                            />
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            <ProFormDigit
                                disabled={disabled}
                                name="advance"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                价值
                            </Row>
                            <Row className="Consign-Title">VALUE</Row>
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                保险
                            </Row>
                            <Row className="Consign-Title">INSURANCE</Row>
                        </Col>
                        <Col className="Consign-Col" span={4}>
                            <Row className="border-bottom Consign-Title">
                                代垫款
                            </Row>
                            <Row className="Consign-Title">PREPAYMENT</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Consign-Title">
                                保险
                            </Row>
                            <Row className="Consign-Title">PAYMENT</Row>
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="Consign-Title border-bottom">
                                FREIGHT PREPAID
                            </Row>
                            <ProFormTextArea
                                disabled={disabled}
                                name="freightPrePayment"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="Consign-Title">合计金额</Row>
                        </Col>
                        <Col className="Consign-Col" span={4}>
                            <Row className="Consign-Field"></Row>
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            <Row className="border-bottom Consign-Title">
                                贸易方式
                            </Row>
                            <Row className="Consign-Title">TRADE MODE</Row>
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
                                onBlur={onInsuranceChange}
                            />
                        </Col>
                        <Col className="Consign-Col" span={4}>
                            <ProFormTextArea
                                disabled={disabled}
                                name="prepayment"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <ProFormTextArea
                                disabled={disabled}
                                name="payment"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="Consign-Title border-bottom">
                                FREIGHT Delivery
                            </Row>
                            <ProFormTextArea
                                disabled={disabled}
                                name="freightDelivery"
                                fieldProps={{
                                    bordered: false,
                                }}
                                placeholder=""
                            />
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="Consign-Title">TOTAL AMOUNT</Row>
                        </Col>
                        <Col className="Consign-Col" span={4}>
                            <Row className="Consign-Field">
                                <ProFormDigit
                                    disabled={disabled}
                                    name="totalAmount"
                                    fieldProps={{
                                        bordered: false,
                                    }}
                                    placeholder=""
                                />
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
                    <Row>
                        <Col className="Consign-Row" span={15}>
                            <Row className="Consign-Field"></Row>
                        </Col>
                        <Col className="Consign-Col" span={2}></Col>
                        <Col
                            className="Consign-Col Consign-Row border-left-none"
                            span={4}
                        ></Col>
                        <Col
                            className="Consign-Col Consign-Row border-left-none"
                            span={3}
                        >
                            <Row className="Consign-Field"></Row>
                        </Col>
                    </Row>
                    <Row className="Consign-Row border-bottom">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Consign-Title">
                                备注
                            </Row>
                            <Row className="Consign-Title">REMARKS</Row>
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
                            <Row className="border-bottom Consign-Title">
                                收货人签字
                            </Row>
                            <Row className="Consign-Title">SIGNATURE</Row>
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
                        <ProFormDigit
                            name="paymentAmount"
                            label="PaidAmount"
                            placeholder=""
                            width="md"
                        />
                        <ProFormSelect
                            options={paymentStatus}
                            width="md"
                            name="paymentStatus"
                            required
                            label="Status"
                            rules={[
                                {
                                    required: true,
                                    message: 'This is required',
                                },
                            ]}
                        />
                    </>
                )}
                <Title
                    style={{
                        marginLeft: 64,
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
                        marginLeft: 64,
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
                        marginLeft: 64,
                        marginRight: 64,
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
        </>
    );
};
