import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  scrollableRef: React.RefObject<HTMLElement | null>;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ scrollableRef }) => {
  const location = useLocation();
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, scrollableRef]);

  return null;
};
