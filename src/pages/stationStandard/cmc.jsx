import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import OrderSearch from "../../components/orderSearch/orderSearch";
import InfoWO from "../../components/orderInfo/infoWO";
import SerialScan from "../../components/orderActionPanel/serialScan";
import TableStationStd from "../../components/table/tableStationStd";
import React, { useState } from 'react';
import api from '../../api/axios'; // Adjust the import based on your project structure


export default function CMC() {
  const [orderData, setOrderData] = useState(null);
  const [serialList, setSerialList] = useState([]);

  const handleWorkOrderChange = async (newOrder) => {
    setOrderData(newOrder);

    if (newOrder?.workorder) {
      try {
        const response = await api.get(`/main/serialnumber/?search=${encodeURIComponent(newOrder.workorder)}`);
        const formatted = response.data.map(item => ({
          sn: item.sn,
          wo: item.work_order,
          prevStation: item.prev_station,
          currentStation: item.current_station,
          nextStation: item.next_station,
          cdate: item.cdate,
          status: item.status
        }));
        setSerialList(formatted); // store initial list
      } catch (err) {
        console.error("Failed to fetch initial serials", err);
      }
    }
  };

  const appendSerial = (newSerial) => {
    setSerialList(prev => [...prev, newSerial]);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="CMC" />
      <OrderSearch child={<InfoWO />} onDataChange={handleWorkOrderChange} serialCount={serialList.length}/>
      <SerialScan orderData={orderData} serialCount={serialList.length} onSerialCreated={appendSerial}/>
      <TableStationStd serialList={serialList}/>
    </div>
  );
}
