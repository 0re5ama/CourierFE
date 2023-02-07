import { Bar } from '@ant-design/plots';
import { ProCard } from '@ant-design/pro-components';
import { Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';
import API from '../../../services/ProductTracking/index';

const { TabPane } = Tabs;

const Dashboard = () => {
    const [recentConsignment, setRecentConsigments] = useState();
    const [consignmentsAtCheckpoints, setConsignmentsAtCheckpoints] =
        useState();
    const [checkpoint, setCheckpoint] = useState([]);
    const [paidConsignments, setPaidConsignments] = useState();
    const [filterConsignments, setFilterConsignments] = useState(0);
    const [loading, setLoading] = useState(false);
    const onChange = async (key) => {
        const noOfConsignments = await API.consignments.filterConsignments(key);
        setFilterConsignments(noOfConsignments?.data?.length);
    };
    const data = checkpoint?.map((x) => ({
        checkpoint: x.name,
        value: x.consignments.length,
    }));

    const config = {
        data,
        xField: 'value',
        yField: 'checkpoint',
        seriesField: 'checkpoint',
        legend: {
            position: 'top-left',
        },
    };

    useEffect(async () => {
        const resRecentConsignments = await API.consignments.recentConsignment(
            setLoading
        );
        setRecentConsigments(resRecentConsignments?.data?.length);

        const resCheckpoint = await API.checkpoint.get(setLoading);
        setCheckpoint(resCheckpoint?.data);
        const resConsignmentsAtCheckpoint =
            await API.consignments.consignmentsAtCheckpoints(setLoading);
        setConsignmentsAtCheckpoints(resConsignmentsAtCheckpoint?.data?.length);
        const paidConsignments = await API.consignments.paidConsignments(
            setLoading
        );
        setPaidConsignments(paidConsignments?.data?.length);
        const resfilterConsignments = await API.consignments.filterConsignments(
            1,
            setLoading
        );
        setFilterConsignments(resfilterConsignments?.data?.length);
    }, []);
    const Items = [
        {
            label: `1 Day`,
            key: '1',
        },
        {
            label: `1 week`,
            key: '2',
        },
        {
            label: `1 Months`,
            key: '3',
        },
        {
            label: `3 Months`,
            key: '4',
        },
        {
            label: `6 Months`,
            key: '5',
        },
        {
            label: `1 year`,
            key: '6',
        },
        {
            label: `All`,
            key: '7',
        },
    ];

    return (
        <>
            <ProCard key="page" direction="row" ghost gutter={16}>
                <Typography>Recent Consignments:{recentConsignment}</Typography>
                <Typography>Paid Consignments:{paidConsignments}</Typography>
                <Typography>
                    Consignments at Checkpoints:{consignmentsAtCheckpoints}
                </Typography>

                <Tabs
                    defaultActiveKey="1"
                    loading={loading}
                    onChange={onChange}
                >
                    {Items.map((x) => (
                        <TabPane tab={x.label} key={x.key}>
                            {`Total consignments in ${x.label} is ${filterConsignments}`}
                        </TabPane>
                    ))}
                </Tabs>

                <Bar {...config} />
            </ProCard>
        </>
    );
};

export default Dashboard;
