// import { useModal } from "../../hooks/useModal";
// import { Modal } from "../ui/modal";
// import Button from "../ui/button/Button";
// import Input from "../form/input/InputField";
// import Label from "../form/Label";
// import Button from "../../components/ui/button/Button";
// import { SearchIcon } from "@/icons";

export default function InfoReport({ data }) {
  return (
    <>
    <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-3">
            Workorder Information
        </h4>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Workorder Number
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {data?.workorder || "-"}
                </p>
            </div>

            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Project Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {data?.project || "-"}
                </p>
            </div>

            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Description
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {data?.description || "-"}
                </p>
            </div>

            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    WO Quantity
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {data?.qty || "-"}
                </p>
            </div>
        </div>
    </div>
    </>
  );
}
