import { ProCard } from '@ant-design/pro-components';
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Select,
    Table,
    Typography,
} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';

const { Title } = Typography;
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
    useEffect(() => {
        toggleEdit();
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
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {(type == 'input' && (
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                )) ||
                    (type == 'select' && (
                        <Select
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
                    (type == 'date' && (
                        <DatePicker
                            ref={inputRef}
                            onPressEnter={save}
                            onBlur={save}
                            format={'YY:MMM:DD'}
                        />
                    ))}
            </Form.Item>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const Item = ({ form, changedItems }) => {
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(1);
    const [cols, setCols] = useState([]);

    const handleDelete = (key) => {
        const newData = items.filter((item) => item.key !== key);
        setItems(newData);
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
            editable: true,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            type: 'num',

            editable: true,
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            key: 'photo',
            type: 'input',
            editable: true,
        },
        {
            title: 'Remarks',
            dataIndex: 'remark',
            key: 'remark',
            type: 'input',
            editable: true,
        },
    ];
    const handleAdd = () => {
        const itemsData = {
            key: count,
            productName: '',
            quantity: 0,
            photo: '',
            remark: '',
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
        form.current?.setFieldsValue({ items: items });
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

    useEffect(() => {
        changedItems(items);
    }, [items]);

    const changedProductData = (data) => {
        setItems(data);
    };
    return (
        <ProCard key="page" direction="row" ghost gutter={16}>
            <ProCard key="form" colSpan={16}>
                <Title level={5}>Items</Title>
                <Button
                    onClick={handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    Add
                </Button>

                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={items}
                    columns={columns}
                />
            </ProCard>
        </ProCard>
    );
};

export default Item;
