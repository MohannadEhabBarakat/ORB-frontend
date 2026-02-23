import { File, Settings } from "lucide-react"

export default function Case() {
    const handleDoubleClick = () => {
        // Handle the double-click event here
        console.log("Case double-clicked!");
      };
    
    const handleSettingsClick = (event: React.MouseEvent) => {
        // Prevent the double-click event from being triggered when clicking the settings icon
        event.stopPropagation();
        console.log("Settings icon clicked!");
      };
  return (
    <div className="rounded-md  px-4 py-2 gap-2 justify-between items-center text-sm flex " onDoubleClick={handleDoubleClick}>
      <File size={16} className="min-w-4" />
      <p className="text-muted-foreground">100 Market St, San Francisco</p>
      <Settings size={12} className="min-w-3 text-muted-foreground" onClick={handleSettingsClick} />
    </div>
  );
}
