import React, { useState, useEffect, useCallback, useRef  } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { PlusIcon } from "@/icons";
import Button from "../ui/button/Button";
import apiHelper from '@/api/apiHelper'; // Adjust the import based on your project structure
import { endpoints } from "@/api/endpoints"; 

// 
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });

const TableProjectMaster = (orderData) => {
  const [rowData, setRowData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const gridApiRef = useRef(null);
  const [pageState, setPageState] = useState({ page: 0, pageSize: 10 });

  const onGridReady = useCallback((params) => {
      gridApiRef.current = params.api;
      // Initial data fetch when the grid is ready
      fetchRowsData(
          gridApiRef.current.paginationGetCurrentPage(), 
          gridApiRef.current.paginationGetPageSize()
      );
  }, []);

  const fetchRowsData = useCallback(async (page, pageSize) => {
    // This function will now accept page and pageSize as parameters
    try {
        const url = `${endpoints.projectmaster()}?page=${page + 1}&page_size=${pageSize}`;
        console.log(url)
        const response = await apiHelper.get(url);
        const data_response = response.data;
        
        const formatted = data_response.results.map(item => ({
            project: item.project,
            description: item.description,
            customer_project: item.customer_project,
            formatmask: item.formatmask,
            date: item.date,
        }));
        
        setRowData(formatted);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    const onPaginationChanged = () => {
        if (gridApiRef.current) {
            fetchRowsData(
                gridApiRef.current.paginationGetCurrentPage(),
                gridApiRef.current.paginationGetPageSize()
            );
        }
    };

    if (gridApiRef.current) {
        // Add the event listener for pagination changes
        gridApiRef.current.addEventListener('paginationChanged', onPaginationChanged);
    }

    // Cleanup function to remove the event listener
    return () => {
        if (gridApiRef.current) {
            gridApiRef.current.removeEventListener('paginationChanged', onPaginationChanged);
        }
    };
  }, [fetchRowsData]);
 

  useEffect(() => {
    // You can use a context or localStorage instead of this
    const html = document.documentElement;
    setIsDarkMode(html.classList.contains("dark"));
  }, []);

  const [columnDefs] = useState([
    { headerName: "Project P/N", field: "project",sort: "asc", sortable: true, filter: true,flex: 1, floatingFilter: true},
    { headerName: "Description", field: "description", sortable: true, flex: 1, filter: true },
    { headerName: "Customer P/N", field: "customer_project", sortable: true, flex: 1, filter: true },
    { headerName: "Formatmask", field: "formatmask", sortable: true, flex: 1, filter: true },
    { headerName: "Last Update", field: "date", sortable: true, flex: 1, filter: true },
    // { headerName: "Create By", field: "create_by", sortable: true, filter: true },
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
  const quickFilterText = 'new filter text';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mt-4">
        <div className="space-y-6">
            <div className="grid grid-cols-2 items-center">
              <div className="col-start-2 flex justify-end">
                <Button size="sm" variant="primary" startIcon={<PlusIcon className="size-5" />}>
                    Create New Project
                </Button>
              </div>
            </div>
            <div className={isDarkMode ? "ag-theme-quartz-dark" : "ag-theme-quartz"} style={{ height: 400, width: "100%" }}>
           <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              serverSideEnablePageSize={true}
              onGridReady={onGridReady}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[1,5,10, 25, 50 , 100]}
            />
            </div>
        </div>
    </div>
    );
};

export default TableProjectMaster;