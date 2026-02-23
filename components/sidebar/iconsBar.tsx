import Icon from "./icone";
import { ActivityIcon } from "@/components/icons/activity";
import { ArchiveIcon } from "@/components/icons/archive";
import { Separator } from "@/components/ui/separator";

export default function IconsBar() {
    
    return (
        <div className="bg-input w-14 h-full flex flex-col items-center justify-start gap-4 py-4 ">
            <Icon id="workbench" IconSVG={ActivityIcon} description="Workbench" />
            <Separator />
            <Icon id="datasets" IconSVG={ArchiveIcon} description="Datasets" />
        </div>
    );
}   