import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
// import 'ag-grid-community/styles/ag-theme-alpine.css'; // ถ้าจะใช้ light mode
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { DownloadIcon } from "../../icons";
import Label from "../form/Label";
import Button from "../ui/button/Button";

// 
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });

const TableTraceability = () => {
  const [rowData, setRowData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // You can use a context or localStorage instead of this
    const html = document.documentElement;
    setIsDarkMode(html.classList.contains("dark"));
  }, []);

  const [columnDefs] = useState([
    { headerName: "Serial Number", field: "sn",sort: "asc", sortable: true, filter: true, floatingFilter: true},
    { headerName: "Workorder", field: "wo", sortable: true, filter: true },
    { headerName: "Prev Station", field: "prevStation", sortable: true, filter: true },
    { headerName: "Current Station", field: "currentStation", sortable: true, filter: true },
    { headerName: "Next Station", field: "nextStation", sortable: true, filter: true },
    { headerName: "Last Update", field: "lastUpdate", sortable: true, filter: true },
    { headerName: "Status", field: "status", sortable: true, filter: true },
  ]);

  useEffect(() => {
    // ตัวอย่าง data สามารถเปลี่ยนเป็น API ได้
    setRowData([
      { sn: "123", wo: "WO123", prevStation: "Station A", currentStation: "Station B", nextStation: "Station A", lastUpdate: "2023-10-01 12:00", status: "In Progress" },
      { sn: "345", wo: "WO123", prevStation: "Station A", currentStation: "Station B", nextStation: "Station V", lastUpdate: "2023-10-01 12:00", status: "In Progress" },
      { sn: "456", wo: "WO123", prevStation: "Station A", currentStation: "Station B", nextStation: "Station B", lastUpdate: "2023-10-01 12:00", status: "In Progress" },
      { sn: "567", wo: "WO123", prevStation: "Station A", currentStation: "Station B", nextStation: "Station D", lastUpdate: "2023-10-01 12:00", status: "In Progress" },
  
    ]);
  }, []);

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
                <Button size="sm" variant="primary" startIcon={<DownloadIcon className="size-5" />}>
                    Excel
                </Button>
              </div>
            </div>
            <div className={isDarkMode ? "ag-theme-quartz-dark" : "ag-theme-quartz"} style={{ height: 400, width: "100%" }}>
            <AgGridReact   rowData={rowData} columnDefs={columnDefs} />
            </div>
        </div>
    </div>
    );
};

export default TableTraceability;