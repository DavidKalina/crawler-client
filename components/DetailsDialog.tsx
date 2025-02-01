import { useState, useEffect } from "react";
import MobilePageDetailsDialog from "./MobilePageDetailsDialog";
import PageDetailsDialog from "./PageDetailsDialog";

const PageDetails = ({
  page,
  open,
  onOpenChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Using the same breakpoint as your Tailwind md: breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <MobilePageDetailsDialog page={page} open={open} onOpenChange={onOpenChange} />
  ) : (
    <PageDetailsDialog page={page} open={open} onOpenChange={onOpenChange} />
  );
};

export default PageDetails;
