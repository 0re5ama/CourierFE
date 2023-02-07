import { ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Table, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import API from '../../../services/ProductTracking/index';

const { Title } = Typography;

export default () => {
    const formRef = useRef();
    const [container, setContainer] = useState([]);
    const { initialState, setInitialState } = useModel('@@initialState');
    const { currentUser } = initialState;
    const [tableLoading, setTableLoading] = useState(false);

    const getContainers = async () => {
        const resContainers = await API.Container.checkpointContainer(
            setTableLoading
        );

        setContainer(
            resContainers.data?.map((x) => ({
                ...x,
                source: x.source.name,
                destination: x.destination.name,
            }))
        );
    };

    const viewContainer = async (id) => {
        console.log('id', id);
        history.push('/productTracking/ConsignmentRemarks', { id });
    };

    const Column = [
        {
            title: 'Vechile No',
            dataIndex: 'vechileNo',
            key: 'vechileNo',
        },

        {
            title: 'Driver No',
            dataIndex: 'driverContactNo',
            key: 'driverNo',
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
        },
        {
            title: 'Destination',
            dataIndex: 'destination',
            key: 'destination',
        },

        {
            title: 'Status',
            dataIndex: 'statusName',
            key: 'status',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => {
                return (
                    <span>
                        {container &&
                            (container.length >= 0 ? (
                                <div>
                                    <a onClick={() => viewContainer(record.id)}>
                                        view
                                    </a>
                                </div>
                            ) : null)}
                    </span>
                );
            },
        },
    ];

    useEffect(async () => {
        await getContainers();
    }, []);

    return (
        <ProCard key="page" direction="row" ghost gutter={16}>
            <ProCard key="form" colSpan={21}>
                <Title level={5}>Containers</Title>
                <Table
                    dataSource={container}
                    columns={Column}
                    loading={tableLoading}
                />
            </ProCard>
        </ProCard>
    );
};
