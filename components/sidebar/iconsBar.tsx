import Icon from "./icone";
import { ActivityIcon } from "@/components/icons/activity";
import { ArchiveIcon } from "@/components/icons/archive";
import { Separator } from "@/components/ui/separator";

export default function IconsBar() {
    
    return (
        <div className="w-12 h-full flex flex-col items-center justify-start gap-4 py-4 bg-accent">
            <Icon id="workbench" IconSVG={ActivityIcon} />
            <Separator />
            <Icon id="datasets" IconSVG={ArchiveIcon} />
        </div>
    );
}   