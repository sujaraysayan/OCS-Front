import React, {useMemo, useState, useEffect , useRef  } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-enterprise";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { DownloadIcon,  XIcon, } from "@/icons";
import Label from "../form/Label";
import { motion, AnimatePresence } from "motion/react";
import Button  from "@/components/ui/seraui/button"
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { data } from "react-router-dom";
import apiHelper from '@/api/apiHelper';
import { endpoints } from "@/api/endpoints";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });

const TableStationStd = ({ serialList, setSerialList }) => {
  const [rowData, setRowData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    // You can use a context or localStorage instead of this
    const html = document.documentElement;
    setIsDarkMode(html.classList.contains("dark"));
  }, []);

  const rowSelection = useMemo(() => { 
    return { 
          mode: 'multiRow' 
      };
  }, []);
  
  const onGridReady = (params) => {
    setGridApi(params.api);
    setRowCount(params.api.getDisplayedRowCount());
  };

  const onModelUpdated = () => {
    if (gridApi) {
      setRowCount(gridApi.getDisplayedRowCount());
    }
  };

  const onRowSelected= () => {
    const selected = gridApi?.getSelectedNodes().map(node => node.data) || [];
    setSelectedRows(selected);
  };

  const [columnDefs] = useState([
    { headerName: "Serial Number", field: "sn", sortable: true, filter: true, floatingFilter: true, flex: 1},
    { headerName: "Workorder", field: "wo", sortable: true, filter: true, flex: 1 },
    // { headerName: "Prev Station", field: "prevStation", sortable: true, filter: true },
    // { headerName: "Current Station", field: "currentStation", sortable: true, filter: true },
    // { headerName: "Next Station", field: "nextStation", sortable: true, filter: true },
    { headerName: "Create Date", field: "cdate", sortable: true, filter: true, flex: 1, sort: "desc",
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);

        const pad = (n) => String(n).padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }, },
    // { headerName: "Status", field: "status", sortable: true, filter: true },
  ]);

  // Theme detection for dark mode
  useEffect(() => {
    const html = document.documentElement;
    const updateTheme = () => {
        setIsDarkMode(html.classList.contains("dark"));
    };
    const observer = new MutationObserver(updateTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    updateTheme(); // Initial call
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setRowData(serialList); // update table when parent passes new list
  }, [serialList]);
  
  const handleDeleteConfirmed = async  () => {

    const selectedIds = selectedRows.map(row => row.sn);
    const workOrder = selectedRows[0]?.wo;

    // Construct request body
    const deletePayload = {
      sn: selectedIds,
      work_order: workOrder, 
    };

    try {
      await apiHelper.delete(endpoints.serialnumber(), {
        data: deletePayload,
      });

      const newData = rowData.filter(row => !selectedIds.includes(row.sn));
      setRowData(newData);
      const newSerialList = serialList.filter(row => !selectedIds.includes(row.sn));
      setSerialList(newSerialList);

      setSelectedRows([]);
      gridApi.deselectAll();
      setOpenConfirm(false);
    } catch (error) {
      alert('Failed to delete serial numbers. Please try again.');
    }
  };

  const quickFilterText = 'new filter text';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mt-4">
        <div className="space-y-6">
            <div className="grid grid-cols-2 items-center">
              <div className="col-start-1">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-3">
                    Workorder Serial Number
                </h4>
              </div>
              <div className="col-start-2 flex justify-end">
                <Button variant="outline" size="sm"  onClick={() => gridRef.current.api.exportDataAsExcel()} iconLeft={<DownloadIcon />}>Excel</Button>
              </div>
            </div>
             {selectedRows.length > 0 && (
                <AnimatePresence>
                  {selectedRows.length > 0 && (
                    <motion.div
                      className="flex  mb-2"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0  }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ type: "spring", duration: 2.5 }}
                    >
                      <Button variant="danger" size="sm" iconLeft={<XIcon />} onClick={() => setOpenConfirm(true)}>Delete</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            <div className={isDarkMode ? "ag-theme-quartz-dark" : "ag-theme-quartz"} style={{ height: 500, width: "100%" }}>
              <AgGridReact   
                ref={gridRef}
                rowData={rowData} 
                columnDefs={columnDefs} 
                rowSelection={rowSelection} 
                enableCellTextSelection={true}
                onGridReady={onGridReady} 
                enableExcelExport={true}
                onModelUpdated={onModelUpdated}
                onSelectionChanged={onRowSelected}
              />
            </div>
            <div className="text-left text-sm text-gray-600 mt-1">
              Showing {rowCount} row{rowCount !== 1 ? "s" : ""}
            </div>
        </div>
        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete <b>{selectedRows.length}</b> serial number
              {selectedRows.length > 1 ? "s" : ""}?
            </p>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirmed}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
    );
};

export default TableStationStd;