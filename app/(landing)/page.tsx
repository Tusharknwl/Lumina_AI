import { Button } from "@/components/ui/button";
import  Link  from "next/link";

const Landingpage = () => {
    return ( 
        <div>landing page (Unprotected)
            <div>
                <Link href="/sign-in">
                    <Button>Sign In</Button>
                </Link>
                <Link href="/sign-up">
                    <Button>Sign Up</Button>
                </Link>
            </div>
        </div>

     );
}
 
export default Landingpage;