import { UnorderedListOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import Link from 'antd/lib/typography/Link';
import { useEffect, useState } from 'react';
import API from '../../services/ProductTracking/index';

const ConsignmentList = ({ onSelect, ...rest }) => {
    const [consignmentLoading, setConsignmentLoading] = useState(false);
    const [consignments, setConsignments] = useState([]);
    const [filteredConsignments, setFilteredConsignments] = useState([]);
    useEffect(() => {
        getConsignments();
    }, []);
    const columns = [
        {
            title: 'S.No.',
            width: '5%',
            render: (_, __, z) => z + 1,
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
            title: 'Source',
            dataIndex: ['startingStation', 'name'],
            key: 'consignee',
        },
        {
            title: 'Destination',
            dataIndex: ['destination', 'name'],
            key: 'destination',
        },
        {
            title: 'PaymentStatus',
            dataIndex: 'paymentStatusName',
            key: 'paymentStatusName',
        },
        // {
        //     title: 'Cartoon Remarks',
        //     dataIndex: 'cartoonRemarks',
        //     key: 'cartoonRemarks',
        //     type: 'input',
        //     editable: true,
        //     disable: true,
        // },
        {
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => {
                return (
                    <span>
                        {consignments &&
                            (consignments?.length >= 0 ? (
                                <div>
                                    <Link>
                                        <UnorderedListOutlined
                                            className=""
                                            onClick={() => onSelect(record.id)}
                                        />
                                    </Link>
                                </div>
                            ) : null)}
                    </span>
                );
            },
        },
    ];

    const getConsignments = async () => {
        const res = await API.consignments.checkpointConsignments(
            setConsignmentLoading
        );

        const data = res?.data?.map((x) => ({
            ...x,
            key: x.id,
            consignmentDate: new Date(x.consignmentDate)
                .toISOString()
                .substring(0, 10),
        }));
        setConsignments(data);
        setFilteredConsignments(data);
    };

    return (
        <ProTable
            // rowSelection={{ ...rowSelection }}
            // components={components}
            // rowClassName={() => 'editable-row'}
            dataSource={filteredConsignments}
            columns={columns}
            loading={consignmentLoading}
            toolbar={{
                search: {
                    onSearch: (value) => {
                        setFilteredConsignments(
                            consignments.filter(
                                (x) =>
                                    x.consignmentNo.indexOf(value) > -1 ||
                                    x.consignee
                                        .toLowerCase()
                                        .indexOf(value.toLowerCase()) > -1
                            )
                        );
                    },
                },
            }}
            search={false}
            options={{
                search: true,
            }}
        />
    );
};

export default ConsignmentList;
