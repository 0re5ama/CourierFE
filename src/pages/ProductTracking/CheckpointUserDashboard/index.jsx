import { Pie } from '@ant-design/plots';
import { ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import API from '../../../services/ProductTracking/index';

export default () => {
    const [incomingConsignmnets, setInComingConsignmnets] = useState();
    const [outgoingConsignments, setOutgoingConsignmnents] = useState();
    const { initialState, setInitialState } = useModel('@@initialState');
    const [receivedConsignments, setReceivedConsignments] = useState(0);
    const [sentConsignments, setsentConsignments] = useState(0);

    const { currentUser } = initialState;

    const data = [
        {
            type: 'Received Consignment',
            value: receivedConsignments,
        },
        {
            type: 'Sent Consignment',
            value: sentConsignments,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };
    useEffect(async () => {
        const receivedConsignments =
            await API.consignments.receivedConsignments();
        setReceivedConsignments(receivedConsignments.data?.length);
        const sentConsignments = await API.consignments.sentConsignments();
        setsentConsignments(sentConsignments.data?.length);
        const resOutgoingConsigment =
            await API.consignments.outgoingConsignments();
        setOutgoingConsignmnents(resOutgoingConsigment.data?.length);
        const resIncomingConsignment =
            await API.consignments.incomingConsignments();
        setInComingConsignmnets(resIncomingConsignment.data?.length);
    }, []);
    return (
        <>
            <ProCard key="page" direction="row" ghost gutter={16}>
                <Typography>
                    Incoming Consignmnet:{incomingConsignmnets}
                </Typography>
                <Typography>
                    Outgoing Consignment:{outgoingConsignments}
                </Typography>
                <Pie {...config} />
            </ProCard>
        </>
    );
};
