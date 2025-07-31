import PageBreadcrumb from "../components/common/PageBreadCrumb";
import OrderSearch from "../components/orderSearch/orderSearch";
import InfoReport from "../components/orderInfo/infoReport";
import TableTraceability from "../components/table/tableTraceability";
import React, { useState } from 'react';


export default function TraceabilityReport() {
  const [orderData, setOrderData] = useState(null);
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Traceability Report" />
      <OrderSearch child={<InfoReport />} onDataChange={setOrderData} />
      <TableTraceability orderData={orderData} />
    </div>
  );
}
