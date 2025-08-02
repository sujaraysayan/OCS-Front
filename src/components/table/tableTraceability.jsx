import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { DownloadIcon } from "../../icons";
import Button from "../ui/button/Button";
import apiHelper from '@/api/apiHelper'; // Adjust the import based on your project structure
import { endpoints } from "@/api/endpoints"; 

// 
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });

const TableTraceability = ({ orderData }) => {
  const [rowData, setRowData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);
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
    const fetchSerialNumbers = async () => {
      try {
        const response = await apiHelper.get(`${endpoints.serialnumber()}?search=${encodeURIComponent(orderData?.workorder || '')}`);
        const data_response = response.data; // <-- FIXED
        
        const formatted = data_response.map(item => ({
          sn: item.sn,
          wo: item.work_order,
          prevStation : item.prev_station,
          currentStation: item.current_station,
          nextStation: item.next_station,
          status: item.status,
          lastUpdate: item.last_update
        }));

        setRowData(formatted);
      } catch (error) {
        console.error('Error fetching serial numbers:', error);
        if (error.response && error.response.status === 404) {
          setError('Workorder not found.');
        } else {
          setError('Something went wrong.');
        }
      }
    };
    

    if (orderData?.workorder) {
      fetchSerialNumbers();
    }
  }, [orderData]);
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