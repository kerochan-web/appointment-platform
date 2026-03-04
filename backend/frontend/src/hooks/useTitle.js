import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    // Appends your brand name to the specific page title
    document.title = `${title} | BOOKIT_`;
  }, [title]);
};

export default useTitle;
