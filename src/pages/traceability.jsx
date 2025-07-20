import PageBreadcrumb from "../components/common/PageBreadCrumb";
import OrderSearch from "../components/common/orderSearch";
import InfoReport from "../components/orderInfo/infoReport";

export default function TraceabilityReport() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Traceability Report" />
      <OrderSearch child={<InfoReport />} />
    </div>
  );
}
