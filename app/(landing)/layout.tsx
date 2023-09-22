const LandingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <main className="h-full bg-[#111827] overflow-auto ">
            <div className="h-full w-full">
                {children}
            </div>
        </main>
     );
}
 
export default LandingLayout;