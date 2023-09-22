import { LandingContrubute } from "@/components/landingContubute";
import { LandingFooter } from "@/components/landingFooter";
import { LandingHero } from "@/components/landingHero";
import { LandingNavbar } from "@/components/landingNavbar";


const Landingpage = () => {
    return ( 
        <div className="h-full">
            <LandingNavbar />
            <LandingHero />
            <LandingContrubute />
            <LandingFooter />

        </div>

     );
}
 
export default Landingpage;