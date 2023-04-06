import ConsignmentList from '@/components/ConsignmentList';
import PrintComponent from '@/components/PrintComponent';
import { ProCard } from '@ant-design/pro-components';
import { Button, Input, Modal, Timeline, Typography } from 'antd';
import { useRef, useState } from 'react';
import API from '../../../services/ProductTracking/index';
import Consignment from '../Consignment';

const { Title } = Typography;
const { Search } = Input;

export default () => {
    const formRef = useRef();
    const [consignmentHistory, setConsignmentHistory] = useState([]);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [id, setId] = useState();
    const [options, setOptions] = useState([]);
    const [consignmentData, setConsignmentData] = useState();
    const handleSearch = (value) => {
        value ? searchResult(value) : [];
    };
    const onSelect = async (id) => {
        setId(id);
        const resSearchConsignment = await API.consignments.searchConsignment(
            id
        );
        const data = resSearchConsignment?.data;
        if (data?.length >= 1) {
            const history = [
                ...data?.map((x) => ({
                    date: x.entryDate,
                    location: x.container.source.name,
                    vehicle: x.container.vechileNo,
                    recivedDate: null,
                })),
                data[data?.length - 1]?.recivedDate && {
                    date: data[data?.length - 1]?.recivedDate,
                    location:
                        data[data?.length - 1]?.container.destination.name,
                    vehicle: data[data?.length - 1]?.container.vechileNo,
                    recivedDate: data[data?.length - 1]?.recivedDate,
                },
            ];
            console.log(history);
            setConsignmentHistory(history);
        }
        const resConsignmentDetail = await API.consignment.getById(id);
        setConsignmentData(resConsignmentDetail?.data);
    };

    const searchResult = async (param) => {
        const resSearchConsignment = await API.consignments.suggestConsignments(
            param
        );
        setOptions(
            resSearchConsignment.data?.map((x) => ({
                value: x.id,
                label: x.consignmentNo,
            }))
        );
    };

    const viewModel = () => {
        setIsModelOpen(true);
    };

    const handleOk = () => {
        setIsModelOpen(false);
    };

    const handleCancel = () => {
        setIsModelOpen(false);
    };

    return (
        <>
            <ProCard key="page" direction="row" gutter={16}>
                <ProCard key="form" colSpan={24}>
                    <Title id="mainTitle" level={3}>
                        Consignments
                    </Title>
                    {/* <ProForm
                        formRef={formRef}
                        params={{ id: '100' }}
                        formKey="election-type-form"
                        dateFormatter={(value, valueType) => {
                            return value.format('YYYY/MM/DD HH:mm:ss');
                        }}
                        submitter={false}
                        autoFocusFirstInput
                    >
                        <AutoComplete
                            dropdownMatchSelectWidth={252}
                            style={{
                                width: 500,
                                verticalAlign: 'middle',
                            }}
                            id="searchConsign"
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
                    </ProForm> */}
                    <ConsignmentList onSelect={onSelect} />
                </ProCard>
            </ProCard>
            <ProCard direction="row" gutter={16}>
                {consignmentHistory.length >= 1 ? (
                    <>
                        <Timeline mode={'left'}>
                            {consignmentHistory?.map((x) => (
                                <Timeline.Item label={x?.date}>
                                    {x?.recivedDate == null
                                        ? x != null
                                            ? `From ${x?.location} through vechileNo ${x?.vehicle}`
                                            : ''
                                        : `Received at ${x?.location} from vechileNo ${x?.vehicle}`}
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </>
                ) : (
                    ''
                )}
                {consignmentData && (
                    <>
                        <Modal
                            visible={isModelOpen}
                            width="100%"
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <PrintComponent data={consignmentData} />
                        </Modal>
                        {consignmentData && (
                            <Consignment data={consignmentData} />
                        )}
                        <Button
                            id="buttonSubmit"
                            onClick={viewModel}
                            type="primary"
                        >
                            View Recipt
                        </Button>
                    </>
                )}
            </ProCard>
        </>
    );
};
