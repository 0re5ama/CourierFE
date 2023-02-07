import ConsignmentRecipt from '@/pages/ProductTracking/ConsignmentRecipt';
import { Button } from 'antd';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
export default ({ data }) => {
    console.log(data);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <>
            <ConsignmentRecipt printRef={componentRef} data={data} />
            <Button onClick={handlePrint}>Print this out!</Button>
        </>
    );
};
