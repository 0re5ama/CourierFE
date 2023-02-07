import { Cascader, Form, Table, Tag, Typography } from 'antd';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import API from '../../services/Security';
import './permission.css';
const { Title } = Typography;

const Permission = ({ form, rolePermission, userForm, userPermission }) => {
    const [permission, setPermission] = useState([]);

    const [options, setOptions] = useState([]);
    const onCascaderChange = (value) => {
        let perms = [...new Set(value.map((x) => x[1]))].map((mod) => {
            let dt = value.filter((z) => z[1] == mod);
            return {
                app: dt[0][0].split(',')[1],
                mod: mod ? mod.split(',')[1] : '',
                fn: dt.map((z) => z[2]),
                key: mod.split(',')[0],
                functionName: dt.map((z) => (z[2] ? z[2].split(',')[1] : null)),
            };
        });
        setPermission(perms);

        form && form.setFieldsValue({ moduleFunctions: perms });
        userForm && userForm.setFieldsValue({ moduleFunctions: perms });
    };

    const moduleFunctionColumns = [
        {
            title: 'Application',
            dataIndex: 'app',
            key: 'app',
        },
        {
            title: 'Module',
            dataIndex: 'mod',
            key: 'mod',
        },

        {
            title: 'Function',
            dataIndex: 'functionName',
            key: 'functionName',
            render: (fn) =>
                fn.map((item, id) => (
                    <Tag key={id} color="volcano">
                        {item}
                    </Tag>
                )),
        },
    ];
    useEffect(async () => {
        const responseApplication = await API.applicationwithmod();
        const applications = responseApplication.data.map((app) => ({
            ...app,
            key: app.id,
        }));
        setOptions(
            applications.map((item) => ({
                value: item.id + ',' + item.name,
                label: item.name,
                isLeaf: false,
                children: item.modules.map((mod) => ({
                    value: mod.id + ',' + mod.description,
                    label: mod.description,
                    children: mod.functions.map((fn) => ({
                        value: fn.id + ',' + fn.functionName,
                        label: fn.functionName,
                        isLeaf: true,
                    })),
                })),
            }))
        );
        rolePermission && onCascaderChange(rolePermission);
        userPermission && onCascaderChange(userPermission);
    }, [rolePermission, userPermission]);
    return (
        <>
            <Form.Item
                label="Permission"
                name="permissions"
                rules={[
                    {
                        required: true,
                        message: 'role must have permission',
                    },
                ]}
            >
                <Cascader
                    placeholder=" Please select"
                    options={options}
                    className="hidden-cascader"
                    onChange={onCascaderChange}
                    changeOnSelect
                    showCheckedStrategy={Cascader.SHOW_CHILD}
                    multiple
                    maxTagCount={0}
                />
            </Form.Item>
            <Title level={4}>Role Module Function</Title>
            <Form.Item name="moduleFunctions">
                <Table
                    dataSource={permission}
                    columns={moduleFunctionColumns}
                />
            </Form.Item>
        </>
    );
};
export default Permission;
