import "../Reporting/reporting.css"
import Sidebar from "../Sidebar/side"

function Reporting() {
    return(
        <>
        <div className="report-side">
            <Sidebar/>
            <div className="reports"></div>
        </div>
        </>
    )
}

export default Reporting