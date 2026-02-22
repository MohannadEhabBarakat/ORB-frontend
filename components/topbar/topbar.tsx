import Logo from "./logo";
import Appearance from "./appearance";
import Tools from "./tools";

export default function Topbar() {
    
    return (
        <div className="w-full h-12 flex items-center justify-between px-5 bg-topbar-accent">
            <Logo />
            <Tools />
            <Appearance />
        </div>
    );
}  