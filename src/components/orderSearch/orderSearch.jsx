import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { SearchIcon } from "../../icons";
import React, { useState } from 'react';
import api from '../../api/axios'; 

export default function OrderSearch({ child , onDataChange , serialCount='-' }) {
  const [workorder, setWorkorder] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.get(`/main/workorder/?search=${encodeURIComponent(workorder)}`);
      const data = response.data; 

      setData(data);
      onDataChange(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Workorder not found.');
        setData(null);
      } else {
        setError(error.response);
        setData(null);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="space-y-6">
          <form className="space-y-4" onSubmit={handleSearch}>
              <div className="flex flex-row">
                  <div className="basis-1/3">
                      <Input
                          type="text"
                          placeholder="Enter Order ID or Serial Number"
                          value={workorder}
                          onChange={(e) => setWorkorder(e.target.value)}
                      />
                  </div>
                  <div className="basis-1/7 ml-4 flex items-end">
                      <Button
                          size="sm"
                          variant="primary"
                          startIcon={<SearchIcon className="size-5" />}
                          type="submit"
                        >
                          Search
                      </Button>
                  </div>
              </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              {child && React.cloneElement(child, { data , serialCount})}
          </form>
      </div>
    </div>
  );
}
