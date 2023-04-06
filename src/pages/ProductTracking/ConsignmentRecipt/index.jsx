import { Button, Col, Row, Typography } from 'antd';
import html2canvas from 'html2canvas';
import React from 'react';
const converter = require('number-to-words');

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
                    <img class="receipt-logo" src="/ADOLogistics.png" />
                    <div>
                        <div class="title">西藏阿卓仓商贸有限公司</div>
                        <div class="subtitle">
                            TIBET ADO TSANG TRADING CO.,LTD
                        </div>
                        <div class="sub-subtitle">
                            ADD:西藏拉萨经济技术开发区综合报税区查验区办公区2楼006号
                        </div>
                    </div>
                    <img class="receipt-qr" src="/qr.jpg" />
                </div>
                <div class="bilti-main">
                    <div class="receipt-info">
                        <div class="col contact-Field">
                            <div class="info">
                                NEPAL : +977-9851067385 / +977-9862276480
                            </div>
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
                        <div class="col Contact-Field"></div>
                    </div>
                </div>
                <div className="Receipt-Form">
                    {/*<h4 id="mainTitle" class="ant-typography">*/}
                    {/*    Consignment Entry*/}
                    {/*</h4>*/}
                    <Row className="Consign-Row">
                        <Col className="Consign-Col border-right-none" span={3}>
                            托运号：Y <br /> CONSIGNMENT NO:
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={9}>
                            {data?.consignmentNo}
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            起运站 <br /> STARTING STATION:
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none"
                            span={9}
                        >
                            {data?.startingStation.name}
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col border-right-none" span={3}>
                            托运日期 <br /> CONSIGNMENT DATE:
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={9}>
                            {new Date(data?.consignmentDate)
                                .toISOString()
                                .substring(0, 10)}
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            到达站 <br /> DESTINATION:
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none"
                            span={9}
                        >
                            {data?.destination?.name}
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col border-right-none" span={3}>
                            托运日期 <br /> CONSIGNEE MARK:
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={9}>
                            {data?.consignee}
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            联系电话 <br /> TELEPHONE:
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
                            货物名称 <br /> DESCRIPTION
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            包装 <br /> PACKAGE
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            件数 <br /> QUANTITY
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            包装费 <br /> PACKING FEE
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            重量 <br /> WEIGHT
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            包装费 <br /> VOLUME
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            税款 <br /> TAX
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            运费 <br /> FREIGHT
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            预付款 <br /> ADVANCE
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            预付款 <br /> BILL CHARGE
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
                            span={2}
                        >
                            {data?.quantity}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={2}
                        >
                            {data?.packingFee}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={2}
                        >
                            {data?.weight}{' '}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={3}
                        >
                            {data?.volume}
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
                            className="Consign-Col Receipt-Align p-signvalue"
                            span={3}
                        >
                            {data?.advance}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align p-signvalue border-right-none"
                            span={3}
                        >
                            {data?.billCharge}
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col" span={3}>
                            价值 <br /> VALUE
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            保险 <br /> INSURANCE
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            垫付运费 <br /> LOCAL FREIGHT
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            付款方式 <br /> PAYMENT METHOD
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            FREIGHT ON DELIVERY
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            合计金额
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={4}>
                            <span>
                                {converter.toWords(
                                    (+data?.packingFee || 0) +
                                        (+data?.tax || 0) +
                                        (+data?.freight || 0) +
                                        (+data?.insurance || 0) +
                                        (+data?.billCharge || 0) +
                                        (+data?.localFreight || 0) -
                                        (+data?.advance || 0)
                                )}
                            </span>
                        </Col>
                        <Col className="Consign-Col border-right-none" span={3}>
                            贸易方式 <br /> TRADE MODE
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
                        <Col className="Consign-Col Receipt-Align" span={3}>
                            元{data?.localFreight}
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            {data?.paymentMethod == 1 ? '现付款' : '提付款'}
                        </Col>
                        <Col className="Consign-Col" span={3}>
                            <div>
                                {(+data?.packingFee || 0) +
                                    (+data?.tax || 0) +
                                    (+data?.freight || 0) +
                                    (+data?.insurance || 0) +
                                    (+data?.billCharge || 0) +
                                    (+data?.localFreight || 0) -
                                    (+data?.advance || 0)}
                            </div>
                        </Col>
                        <Col className="Consign-Col" span={2}>
                            TOTAL AMOUNT
                        </Col>
                        <Col className="Consign-Col Receipt-Align" span={4}>
                            元
                            {(+data?.packingFee || 0) +
                                (+data?.tax || 0) +
                                (+data?.freight || 0) +
                                (+data?.insurance || 0) +
                                (+data?.billCharge || 0) +
                                (+data?.localFreight || 0)}
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none"
                            span={3}
                        >
                            {data?.tradeMode}
                        </Col>
                    </Row>
                    <Row className="Consign-Row">
                        <Col className="Consign-Col border-bottom" span={3}>
                            备注 <br /> REMARKS
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-bottom"
                            span={14}
                        >
                            {data?.remarks}
                        </Col>
                        <Col className="Consign-Col border-bottom" span={3}>
                            收货人签字 <br /> SIGNATURE
                        </Col>
                        <Col
                            className="Consign-Col Receipt-Align border-right-none border-bottom"
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
