import { createContext, useState } from "react";


const ShowPageContext = createContext();

function Provider({children}) {
    const [showIndexPage, setShowIndexPage] = useState(true);
    const [showJobsPage, setShowJobsPage] = useState(false);
    const [showDataPage, setShowDataPage] = useState(false);
    const [showAppDataPage, setAppShowDataPage] = useState(false);

    const valueToShare = {
        showIndexPage,
        setShowIndexPage,
        showJobsPage,
        setShowJobsPage,
        showDataPage,
        setShowDataPage,
        showAppDataPage,
        setAppShowDataPage
    }

   
    return (
        <ShowPageContext.Provider value={valueToShare}>
            {children}
        </ShowPageContext.Provider>
    )

};

export { Provider };
export default ShowPageContext;