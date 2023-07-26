import React, { useRef } from 'react'
import AddElementToReport from './AddElementToReport'
import { useSelector } from 'react-redux'
import PrintHeader from '../../Printing/PrintHeader'
import PrintDailyReport from '../../Printing/PrintDailyReport'
import ReactToPrint from 'react-to-print'
import BackButton from 'src/components/Navigating/BackButton'

const DailySalesReportView = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const reportDate = useSelector((state) => state.selection.selected.date)
  const totals = useSelector((state) => state.selection.selected.totals)
  const reportItems = useSelector(
    (state) => state.selection.selected.DailyMoneyDetails,
  )
  const user = useSelector((state) => state.selection.selected.receiver)

  return (
    <div>
      {reportItems && reportItems.length !== 0 ? (
        <div className="d-flex gap-2">
          <BackButton />
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        </div>
      ) : null}
      <div style={{ display: 'none' }}>
        <div className="m-3 p-0" ref={ref || componentRef}>
          <PrintHeader />
          <p className="fs-4 fw-bolder text-center my-1">
            {' '}
            Daily sales report of{' '}
            {new Date(reportDate).toLocaleDateString('fr-FR')}{' '}
          </p>

          <AddElementToReport
            user={[user]}
            reportItems={reportItems}
            totals={totals}
          />
          <PrintDailyReport />
        </div>
      </div>

      <AddElementToReport
        totals={totals}
        reportItems={reportItems}
        user={[user]}
      />
    </div>
  )
})

export default DailySalesReportView
