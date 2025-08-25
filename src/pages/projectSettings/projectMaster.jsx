import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableProjectMaster from "@/components/table/tableProjectMaster";
import React, { useState } from 'react';
import apiHelper from '@/api/apiHelper'; 
import { endpoints } from "@/api/endpoints"; 

export default function ProjectMaster() {
  const [orderData, setOrderData] = useState(null);
  const [serialList, setSerialList] = useState([]);

  const handleWorkOrderChange = async (newOrder) => {
    setOrderData(newOrder);

    if (newOrder?.workorder) {
      try {
        const response = await apiHelper.get(`${endpoints.serialnumber()}?search=${encodeURIComponent(newOrder.workorder)}`);
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
      <PageBreadcrumb pageTitle="Project Master" />
      <TableProjectMaster />
    </div>
  );
}
