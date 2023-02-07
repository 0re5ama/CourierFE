import { Button, Col, Row, Typography } from 'antd';
import html2canvas from 'html2canvas';
import React from 'react';

const { Title } = Typography;

export default React.forwardRef(({ data, printRef }) => {
    const handleDownloadImage = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);

        const data = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = data;
            link.download = 'image.jpg';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(data);
        }
    };

    return (
        <>
            <div class="Consign-Receipt" ref={printRef}>
                <div class="bilti-header">
                    <div class="logo"></div>
                    <div>
                        <div class="title">西藏阿卓仓商贸有限公司</div>
                        <div class="subtitle">
                            TIBET ADO TSANG TRADING CO.,LTD
                        </div>
                        <div class="sub-subtitle">
                            ADD:西藏拉萨经济技术开发区综合报税区查验区办公区2楼006号
                        </div>
                    </div>
                </div>
                <div class="bilti-main">
                    <div class="receipt-info">
                        <div class="col contact-Field">
                            <div class="info">NEPAL : +977-9851067385</div>
                            <div class="info">RASUWA: +977-9846209252</div>
                            <div class="info">TATOPANI: +977-9846207176</div>
                        </div>
                        <div class="col Contact-Field">
                            <div class="info">
                                MOBILE - CHINESE SPEAKING : 13322519322
                            </div>
                            <div class="info">
                                MOBILE - NEPALI SPEAKING : 19908916803
                            </div>
                            <div class="info">EMAIL : 1973459072@qq.com</div>
                        </div>
                        <div class="col">
                            <div class="qr"></div>
                        </div>
                    </div>
                </div>
                <div className="Receipt-Form">
                    {/*<h4 id="mainTitle" class="ant-typography">*/}
                    {/*    Consignment Entry*/}
                    {/*</h4>*/}
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                托运号：Y
                            </Row>
                            <Row className="Receipt-Title">CONSIGNMENT NO:</Row>
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={9}>
                            {data?.consignmentNo}
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                起运站
                            </Row>
                            <Row className="Receipt-Title">
                                STARTING STATION:
                            </Row>
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none"
                            span={9}
                        >
                            {data?.startingStation.name}
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                托运日期
                            </Row>
                            <Row className="Receipt-Title">
                                CONSIGNMENT DATE:
                            </Row>
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={9}>
                            {new Date(data?.consignmentDate)
                                .toISOString()
                                .substring(0, 10)}
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                到达站
                            </Row>
                            <Row className="Receipt-Title">DESTINATION:</Row>
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none"
                            span={9}
                        >
                            {data?.destination?.name}
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                托运日期
                            </Row>
                            <Row className="Receipt-Title">CONSIGNEE MARK:</Row>
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={9}>
                            {data?.consignee}
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                联系电话
                            </Row>
                            <Row className="Receipt-Title">TELEPHONE:</Row>
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none"
                            span={9}
                        >
                            {data?.telephone}
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                货物名称
                            </Row>
                            <Row className="Receipt-Title">DESCRIPTION</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Receipt-Title">
                                包装
                            </Row>
                            <Row className="Receipt-Title">PACKAGE</Row>
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                件数
                            </Row>
                            <Row className="Receipt-Title">QUANTITY</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Receipt-Title">
                                箱号
                            </Row>
                            <Row className="Receipt-Title">CTN NO</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Receipt-Title">
                                包装费
                            </Row>
                            <Row className="Receipt-Title">EXPENSE</Row>
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                包装费
                            </Row>
                            <Row className="Receipt-Title">CBM</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Receipt-Title">
                                重量
                            </Row>
                            <Row className="Receipt-Title">WEIGHT</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Receipt-Title">
                                税款
                            </Row>
                            <Row className="Receipt-Title">TAX</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Receipt-Title">
                                运费
                            </Row>
                            <Row className="Receipt-Title">FREIGHT</Row>
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                预付款
                            </Row>
                            <Row className="Receipt-Title">ADVANCE</Row>
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={3}
                        >
                            {data?.description}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={2}
                        >
                            {data?.package?.name}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={3}
                        >
                            {data?.quantity}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={2}
                        >
                            {data?.ctnNo}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={2}
                        >
                            {data?.expense}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={3}
                        >
                            {data?.cbm}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={2}
                        >
                            {data?.weight}{' '}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={2}
                        >
                            {data?.tax}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={2}
                        >
                            {data?.freight}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue border-right-none"
                            span={3}
                        >
                            {data?.advance}
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                价值
                            </Row>
                            <Row className="Receipt-Title">VALUE</Row>
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                保险
                            </Row>
                            <Row className="Receipt-Title">INSURANCE</Row>
                        </Col>
                        <Col className="Consign-Col" span={4}>
                            <Row className="border-bottom Receipt-Title">
                                代垫款
                            </Row>
                            <Row className="Receipt-Title">PREPAYMENT</Row>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="border-bottom Receipt-Title">
                                保险
                            </Row>
                            <Row className="Receipt-Title">PAYMENT</Row>
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="Receipt-Title border-bottom">
                                FREIGHT PREPAID
                            </Row>
                            {data?.freightPrepaid}
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="Receipt-Title">合计金额</Row>
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={4}>
                            小写: 796.7+45=841.7元
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                贸易方式
                            </Row>
                            <Row className="Receipt-Title">TRADE MODE</Row>
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={3}
                        >
                            元{data?.value}
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={3}>
                            元{data?.insurance}
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={4}>
                            元{data?.prepayment}
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={2}>
                            元{data?.payment}
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="Receipt-Title">
                                FREIGHT Delivery
                            </Row>
                            <div>{data?.freightDelivery}</div>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            <Row className="Receipt-Title">TOTAL AMOUNT</Row>
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={4}>
                            元{data?.totalAmount}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none"
                            span={3}
                        >
                            {data?.tradeMode}
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            className="Consign-Row Receipt-Align p-signvalue t-white"
                            span={15}
                        >
                            .
                        </Col>
                        <Col className="Consign-Col" span={2}></Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue border-top border-left-none"
                            span={4}
                        ></Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue border-top border-left-none"
                            span={3}
                        ></Col>
                    </Row>
                    <Row className="Consign-Row border-bottom">
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                备注
                            </Row>
                            <Row className="Receipt-Title">REMARKS</Row>
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={14}>
                            {data?.remarks}
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <Row className="border-bottom Receipt-Title">
                                收货人签字
                            </Row>
                            <Row className="Receipt-Title">SIGNATURE</Row>
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none"
                            span={4}
                        >
                            {data?.signature}
                        </Col>
                    </Row>
                </div>
                <div class="bilti-footer">
                    <h4>注意事项（NOTES)</h4>
                    <ol>
                        <li>
                            必须申报货物实际价值，如不进行申报后果自负。
                            <br />
                            MUST DECLARE THE ACTUAL VALUE OF THE GOODS,SUN AS
                            NOT TO DECLARE THE CONSEQUENCES.
                        </li>
                        <li>
                            不许虚假，不许在货物中夹藏危险品或任何有关法律禁运的货物，如不遵守此规定后果自负。
                            <br />
                            FALSE CAGON NAME,ZECRETCARRIAGE OF DANGEROUS GOODS
                            AND PROHIBITED GOODS ARE FORBIDDEN,OTHER WISE ALL
                            THE LOSS SHALL BE BORN BY THE CONSIGNOR.
                        </li>
                        <li>
                            THIS IS TO INFORM THAT COLLECT GOODS IN JILONG AFTER
                            ONE MONTH(WHEN MALRNB FOR 1 CBM AND AFTER 40DAYS ONE
                            DAY 3RMB FOR 1CBM IF TWO MONTHS
                            <br />
                            DO NO GOODS THE TRANSPORT WILL HANDLE THE GOODS THEN
                            WE WILL NOT BE RESPONSSIBLE)
                        </li>
                    </ol>
                </div>
            </div>
            <Button onClick={handleDownloadImage}>Downlood Photo</Button>
        </>
    );
});
