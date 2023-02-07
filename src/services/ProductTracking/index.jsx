import { baseURL, get, post } from '../api';
import api from '../genericService';

export default {
    container: api('/Container'),
    itemGroup: api('/ItemGroup'),
    item: api('/Item'),
    Package: api('/Package'),
    consignment: api('/Consignment'),
    checkpoint: api('/Checkpoint'),
    groupsItem: {
        groupsItems: (id, setLoader) =>
            get(baseURL + '/Item/groups-item/' + id, setLoader),
    },
    Container: {
        transferContainer: (data, setLoader) =>
            post(baseURL + '/Container/transfer-container', data, setLoader),
        checkpointContainer: (setLoader) =>
            get(baseURL + '/Container/checkpointContainer', setLoader),
        ExcellExport: () => get(baseURL + '/ExcellExport' + id),
    },
    consignments: {
        recentConsignment: () =>
            get(baseURL + '/Consignment/recent-consignments'),

        receivedConsignments: () =>
            get(baseURL + '/Consignment/received-consignments'),
        sentConsignments: () => get(baseURL + '/Consignment/sent-consignments'),
        searchConsignment: (id) =>
            get(baseURL + '/Consignment/search-consignments/' + id),
        incomingConsignments: () =>
            get(baseURL + '/Consignment/incoming-consignments'),
        outgoingConsignments: () =>
            get(baseURL + '/Consignment/outgoing-consignments'),
        paidConsignments: () => get(baseURL + '/Consignment/paid-consignments'),
        consignmentsAtCheckpoints: () =>
            get(baseURL + '/Consignment/consignmentsAtCheckpoints'),
        filterConsignments: (time, setLoader) =>
            get(baseURL + '/Consignment/filterConsignments/' + time, setLoader),
        suggestConsignments: (param, setLoader) =>
            get(
                baseURL + '/Consignment/suggestConsignments/' + param,
                setLoader
            ),
        checkpointConsignments: (setLoader) =>
            get(baseURL + '/Consignment/checkpointConsignments', setLoader),
    },
    enum: {
        containerType: (setLoader) =>
            get(baseURL + '/ContainerType', setLoader),
        containerStatus: (setLoader) =>
            get(baseURL + '/ContainerStatus', setLoader),
        status: (setLoader) => get(baseURL + '/Status', setLoader),
        recivedStatus: (setLoader) =>
            get(baseURL + '/RecivedStatus', setLoader),
        paymentStatus: (setLoader) =>
            get(baseURL + '/PaymentStatus', setLoader),
    },
    checkpoints: {
        checkpointlessUser: () =>
            get(baseURL + '/Checkpoint/checkpointlessUser'),
    },
};
