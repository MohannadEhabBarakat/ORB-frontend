import IconsBar from "./iconsBar";
import DetailsBar from "./detailsBar";
export default function MainMenu() {

    return (
        <div className="min-w-32 w-full h-full flex  bg-secondary/50 overflow-hidden">
            <IconsBar />
            <DetailsBar />
        </div>
    );
}   