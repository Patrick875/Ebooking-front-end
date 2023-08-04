import React, { useEffect, useRef, useState } from 'react'
import { CCardHeader, CCol, CRow } from '@coreui/react'
import { instance } from 'src/API/AxiosInstance'
import InvoiceHeader from '../Printing/InvoiceHeader'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import RoomReportTable from './RoomReportTable'
import ReactToPrint from 'react-to-print'

const Room = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const [rooms, setRooms] = useState([])
  const [roomClasses, setRoomClasses] = useState([])
  useEffect(() => {
    const getRooms = async () => {
      await instance
        .get('/room/all')
        .then((res) => {
          setRooms(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    const getRoomClasses = async () => {
      await instance
        .get('/roomclass/all')
        .then((res) => {
          setRoomClasses(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getRooms()
    getRoomClasses()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <div className="mb-4" style={{ backgroundColor: 'none' }}>
          <CCardHeader className="d-flex justify-content-between">
            <h4>
              <strong className="text-uppercase">
                {' '}
                Room status report on {new Date().toLocaleDateString(
                  'fr-FR',
                )}{' '}
              </strong>
            </h4>
            <div className="col-2">
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-ghost-primary">Print</button>
                )}
                content={() => ref || componentRef.current}
              />
            </div>
          </CCardHeader>
          <div style={{ backgroundColor: 'none' }}>
            <div style={{ display: 'none' }}>
              <div ref={ref || componentRef}>
                <InvoiceHeader />
                <div className="col mx-4">
                  <p className="text-uppercase  text-center fw-bold border border-2">
                    {' '}
                    Room status report on{' '}
                    {new Date().toLocaleDateString('fr-FR')}{' '}
                  </p>
                </div>

                <RoomReportTable
                  rooms={rooms}
                  roomClasses={roomClasses}
                  setRooms={setRooms}
                />
                <PrintFooterNoSignatures />
              </div>
            </div>
            <RoomReportTable
              rooms={rooms}
              roomClasses={roomClasses}
              setRooms={setRooms}
            />
          </div>
        </div>
      </CCol>
    </CRow>
  )
})

export default Room
