import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import OrderSearch from "../../components/common/orderSearch";
import InfoReport from "../../components/orderInfo/infoReport";
import TableTraceability from "../../components/table/tableTraceability";


export default function CMC() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CMC" />
      <OrderSearch child={<InfoReport />} />
      <TableTraceability />
    </div>
  );
}
