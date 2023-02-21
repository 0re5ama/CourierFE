import { ProCard } from '@ant-design/pro-components';
import { Button, Table, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'umi';
import API from '../../../services/ProductTracking/index';
const { Title } = Typography;

export default () => {
    const formRef = useRef();

    const [action, setAction] = useState('A');
    const [Item, setItem] = useState([]);
    const [ItemCol, setItemCol] = useState([]);
    const [itemGroup, setItemGroup] = useState([]);
    const [tableLoading, SetTableLoading] = useState(false);

    const getItems = async () => {
        const resItem = await API.item.get(SetTableLoading);
        setItem(
            resItem?.data.map((x) => ({
                ...x,
                itemGroup: x.itemGroup.name,
            }))
        );
    };

    const ItemColumn = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'ItemGroup',
            dataIndex: 'itemGroup',
            key: 'itemGroup',
        },

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Name Short',
            dataIndex: 'nameShort',
            key: 'nameShort',
        },
        {
            title: 'Status',
            dataIndex: 'statusName',
            key: 'status',
        },
    ];

    useEffect(async () => {
        await getItems();

        const resItemGroup = await API.itemGroup.get();
        setItemGroup(
            resItemGroup?.data?.map((x) => ({
                label: x.name,
                value: x.id,
            }))
        );
        setItemCol([
            {
                title: 'S.No.',
                width: '5%',
                render: (_, __, z) => z + 1,
            },
            ...ItemColumn.filter((x) => x.dataIndex !== 'id'),
        ]);
    }, []);

    return (
        <>
            <ProCard key="page" direction="row" ghost gutter={16}>
                <ProCard key="form" colSpan={21}>
                    <Title level={5}>Items</Title>
                    <Table
                        dataSource={Item}
                        columns={ItemCol}
                        loading={tableLoading}
                    />
                </ProCard>
            </ProCard>
            <Button type="primary" id="buttonAdd">
                <Link to="/ProductTracking/Item">Add Items</Link>
            </Button>
        </>
    );
};
