import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { removeLabel } from "@/store/features/tools/labels";
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'

export default function LabelItem({color, label, isOpen}:{isOpen:boolean, color:string, label:string}) {
  const dispatch = useDispatch();
  const deleteLabel = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
    const confirmed = confirm(`Are you sure you want to delete the label "${label}"? This action cannot be undone.`);
    if (confirmed) {
      dispatch(removeLabel(label))
    }
  }
  return (
    <div className="w-full flex flex-row items-center justify-between">
        <span className={`text-sm text-muted-foreground w-3 h-3 ${color}  mr-5`}></span>
        <span className="text-sm text-muted-foreground mr-5">{label}</span>
        {isOpen && (<>
        {/* <Button disabled variant="ghost" size="xs" className="hover:cursor-pointer" > <Pen size={10}/> </Button>  */}
        <Button variant="ghost" size="xs" className="hover:cursor-pointer z-100" onPointerDown={(e) => deleteLabel(e)}> <Trash2 size={10}/> </Button> 
        </>)}
    </div>
  );
}
