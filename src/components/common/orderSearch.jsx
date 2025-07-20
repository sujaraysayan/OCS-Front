// import { useModal } from "../../hooks/useModal";
// import { Modal } from "../ui/modal";
// import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../../components/ui/button/Button";
import { SearchIcon } from "../../icons";

export default function OrderSearch({child}) {
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
            <form className="space-y-4">
                <div className="flex flex-row">
                    <div className="basis-1/3">
                        <Input
                            type="text"
                            value=""
                            placeholder="Enter Order ID or Serial Number"

                        />
                    </div>
                    <div className="basis-1/7 ml-4 flex items-end">
                        <Button
                            size="sm"
                            variant="primary"
                            startIcon={<SearchIcon className="size-5" />}
                            >
                            Search
                        </Button>
                    </div>
                </div>
                {child}
            </form>
        </div>
      </div>
    </>
  );
}
