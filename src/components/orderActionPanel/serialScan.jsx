
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import React, { useState , useEffect } from 'react';
import apiHelper from '@/api/apiHelper';
import { endpoints } from "@/api/endpoints";

export default function SerialScan({orderData , serialCount, onSerialCreated }) {
  const [serialNo, setSerialNo] = useState('');
  const [error, setError] = useState(null);
  const isDisabled = orderData ? serialCount >= orderData.qty : true;
 
  // show message if workorder is full
  useEffect(() => {
    if (orderData?.qty !== undefined && serialCount >= orderData.qty) {
      setError('Workorder is full. All serial numbers have been scanned.');
    } else {
      setError(null);
    }
  }, [serialCount, orderData?.qty]);

  // This function will be called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data_body = {
        "sn": serialNo,
        "work_order": orderData.workorder
      }

      const response = await apiHelper.post(`${endpoints.serialnumber()}`, data_body);
      const data_response = response.data; // <-- FIXED
      setSerialNo('');
      // Handle the API response (e.g., pass data to parent, set state, etc.)
      const formatted = {
        sn: data_response.sn,
        wo: data_response.work_order,
        prevStation: data_response.prev_station,
        currentStation: data_response.current_station,
        nextStation: data_response.next_station,
        lastUpdate: data_response.last_update,
        status: data_response.status
      }
      onSerialCreated(formatted); 
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const apiError = error.response.data;

        // If it's a known message from backend, show that
        if (typeof apiError === 'string') {
          setError(apiError);
        } else if (typeof apiError === 'object') {
          // Collect all error messages from Django/DRF format
          const messages = Object.entries(apiError)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
          alert(messages || 'An error occurred.');
        } else {
          setError('Something went wrong.');
        }
      } else {
        setError('Network error or server is unreachable.');
      }
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mt-4">
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-3">
            Action Panel
          </h4>
          <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-row">
                  <div className="basis-1/3">
                      <Input
                          type="text"
                          placeholder="Scan Serial Number"
                          value={serialNo}
                          onChange={(e) => setSerialNo(e.target.value)}
                          disabled={isDisabled}
                      />
                  </div>
                  <div className="basis-1/7 ml-4 flex items-end">
                      <Button
                          size="sm"
                          variant="success"
                          type="submit"
                          disabled={isDisabled}
                        >
                          Save
                      </Button>
                  </div>
              </div>
          </form>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </div>
      </div>
    </>
  );
}
