import { CCard } from '@coreui/react'
import { FaWarehouse } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import { selectStore } from 'src/redux/Select/selectStore'

function AllStores(props) {
  const [store, setStore] = useState([])
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.role)
  useEffect(() => {
    const getAllStores = async () => {
      await instance.get('/stock/store/all').then((res) => {
        setStore(res.data.data)
      })
    }
    getAllStores()
  }, [])
  return (
    <div className="d-flex gap-2 flex-wrap ">
      {store && store.length !== 0 ? (
        store.map((item, i) =>
          item.status === 'DISACTIVE' && role !== 'admin' ? null : (
            <CCard
              key={i}
              className={`col-2 text-center p-2 flex-grow-2 petit-card ${
                item.status === 'DISACTIVE' ? 'bg-danger' : ''
              }`}
            >
              <div className="m-2 ">
                <FaWarehouse size="sm" />
              </div>
              <p className="mt-2 text-capitalize ">{item.name}</p>

              <div className="overlay">
                <Link
                  to="/booking/store/view"
                  className="btn btn-sm btn-outline-primary"
                  disabled={item.status === 'DISACTIVE' ? true : false}
                  onClick={() => dispatch(selectStore(item))}
                >
                  View
                </Link>
              </div>
            </CCard>
          ),
        )
      ) : (
        <div>No Store registered</div>
      )}
    </div>
  )
}

export default AllStores
