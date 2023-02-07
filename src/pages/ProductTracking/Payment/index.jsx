import {
    ProForm,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { AutoComplete, Button, Input, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import API from '../../../services/ProductTracking/index';
import Consignment from '../Consignment';

const { Title } = Typography;

export default () => {
    const formRef = useRef();
    const [consignments, setConsignments] = useState([]);
    const [checkpoint, setCheckpoint] = useState([]);
    const [Package, setPackage] = useState([]);
    const [actionRecipt, setActionRecipt] = useState('E');
    const [actionconsignment, setActionConsignment] = useState('A');
    const [paymentStatus, setPaymentStatus] = useState([]);
    const [options, setOptions] = useState([]);
    const [consignmentData, setConsignmentData] = useState();
    const [loadSubmit, setLoadSubmit] = useState(false);
    const reset = async () => {
        await formRef.current?.resetFields();
    };

    const submit = async (values) => {
        const data = {
            ...values,
            ...consignmentData,
        };
        await API.consignment.put(values.id, data, setLoadSubmit);
    };
    useEffect(async () => {
        const resPaymentStatus = await API.enum.paymentStatus();
        setPaymentStatus(
            resPaymentStatus?.data?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
    }, []);

    const searchResult = async (param) => {
        const resSearchConsignment = await API.consignments.suggestConsignments(
            param
        );
        setOptions(
            resSearchConsignment?.data?.map((x) => ({
                value: x.id,
                label: x.consignmentNo,
            }))
        );
    };

    const onSelect = async (id) => {
        const resSearchConsignment = await API.consignment.getById(id);
        const data = resSearchConsignment?.data;
        setConsignmentData(data);
        resSearchConsignment?.isSuccess && setActionRecipt('A');
        formRef.current.setFieldsValue(data);
    };
    const handleSearch = (value) => {
        value ? searchResult(value) : [];
    };
    return (
        <>
            <div className="Consign-Form">
                <Title id="mainTitle" level={3}>
                    Consignment Payment
                </Title>
                <ProForm
                    onFinish={submit}
                    formRef={formRef}
                    params={{ id: '100' }}
                    formKey="election-type-form"
                    dateFormatter={(value, valueType) => {
                        console.log('---->', value, valueType);
                        return value.format('YYYY/MM/DD');
                    }}
                    submitter={
                        actionRecipt == 'A'
                            ? {
                                  render: (props, dom) => [
                                      <Button
                                          type="primary"
                                          loading={loadSubmit}
                                          key="submit"
                                          onClick={() => props.form?.submit?.()}
                                      >
                                          Submit
                                      </Button>,
                                      <Button
                                          type="default"
                                          key="submit"
                                          onClick={reset}
                                      >
                                          Reset
                                      </Button>,
                                  ],
                              }
                            : false
                    }
                    autoFocusFirstInput
                >
                    <ProFormText name="id" hidden />{' '}
                    <AutoComplete
                        id="searchConsign"
                        dropdownMatchSelectWidth={252}
                        style={{
                            width: 300,
                        }}
                        options={options}
                        onSelect={onSelect}
                        onSearch={handleSearch}
                    >
                        <Input.Search
                            size="large"
                            placeholder="Search Consignment"
                            enterButton
                        />
                    </AutoComplete>
                    {consignmentData && (
                        <>
                            <Consignment data={consignmentData} />

                            <ProFormDigit
                                name="paidAmount"
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
                </ProForm>
            </div>
        </>
    );
};
