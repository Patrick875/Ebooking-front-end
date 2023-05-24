import { CCard } from '@coreui/react'
import './PetitStock.css'
import React, { useEffect, useState } from 'react'
import { FcIcons8Cup } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectPetitStock } from 'src/redux/Select/selectPetitStockActions'
import { useDispatch, useSelector } from 'react-redux'

function AllPetitStock(props) {
  const { selling, setStock } = props
  const [petitStock, setPetitStock] = useState([])
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.role)
  useEffect(() => {
    const getAllPetitStock = async () => {
      await instance.get('/petit-stock/all').then((res) => {
        setPetitStock(res.data.data)
        console.log('all the stuff', res.data.data)
      })
    }
    getAllPetitStock()
  }, [])
  return (
    <div className="d-flex gap-2 flex-wrap ">
      {petitStock && petitStock.length !== 0 ? (
        petitStock.map((item, i) => {
          return item.status === 'DISACTIVE' && role !== 'admin' ? null : (
            <CCard
              key={i}
              className={`col-2 text-center p-2 flex-grow-2 petit-card ${
                item.status === 'DISACTIVE' ? 'bg-danger' : ''
              }`}
            >
              <div className="m-2">
                <FcIcons8Cup size="sm" />
              </div>
              <p className="mt-2 text-capitalize ">{item.name}</p>
              {selling ? (
                item.status === 'DISACTIVE' && role !== 'admin' ? null : (
                  <div className="overlay">
                    <Link
                      className="btn btn-sm btn-outline-danger "
                      onClick={() => {
                        setStock(item.name)
                      }}
                    >
                      Sell
                    </Link>
                  </div>
                )
              ) : (
                <div className="overlay">
                  <Link
                    to="/booking/petitstock/items/all"
                    className="btn btn-sm btn-outline-primary"
                    disabled={item.status === 'DISACTIVE' ? true : false}
                    onClick={() => dispatch(selectPetitStock(item))}
                  >
                    View
                  </Link>
                </div>
              )}
            </CCard>
          )
        })
      ) : (
        <div>No Petit Stock registered</div>
      )}
    </div>
  )
}

export default AllPetitStock
