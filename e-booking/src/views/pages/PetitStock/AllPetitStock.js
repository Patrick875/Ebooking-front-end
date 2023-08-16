import { CCard } from '@coreui/react'
import './PetitStock.css'
import React, { useEffect, useState } from 'react'
import { FcIcons8Cup } from 'react-icons/fc'
import { Link, useLocation } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectPetitStock } from 'src/redux/Select/selectPetitStockActions'
import { useDispatch, useSelector } from 'react-redux'
import { GrRestaurant } from 'react-icons/gr'
import Lounge from './../../../assets/images/Lounge.png'
import PoolBarIcon from './../../../assets/images/pool-bar-icon.png'
function AllPetitStock(props) {
  const { selling, setStock } = props
  const [petitStock, setPetitStock] = useState([])
  const dispatch = useDispatch()
  const url = useLocation()
  const role = useSelector((state) => state.auth.role)
  useEffect(() => {
    const getAllPetitStock = async () => {
      await instance
        .get('/petit-stock/all')
        .then((res) => {
          setPetitStock(res.data.data)
          console.log('petit-stocks', res.data.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    getAllPetitStock()
  }, [])
  return (
    <div className="d-flex gap-2 flex-wrap ">
      {petitStock && petitStock.length === 0 ? (
        <p>No petit stock registered </p>
      ) : petitStock &&
        petitStock.length !== 0 &&
        url &&
        url.pathname === '/booking/petitstock/all' ? (
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
      ) : petitStock &&
        petitStock.length !== 0 &&
        url &&
        url.pathname === '/booking/products/sell' ? (
        petitStock
          .filter((el) => el.selling === 'selling')
          .map((item, i) => {
            return item.status === 'DISACTIVE' && role !== 'admin' ? null : (
              <CCard
                key={i}
                className={`col-2 text-center p-2 flex-grow-2 petit-card ${
                  item.status === 'DISACTIVE' ? 'bg-danger' : ''
                }`}
              >
                <div className="m-2">
                  {item.name === 'Kitchen' ? (
                    <GrRestaurant size="sm" />
                  ) : item.name.trim().toLowerCase() === 'lounge bar' ? (
                    <img
                      alt="lounge bar icon"
                      src={Lounge}
                      width={102}
                      height={124}
                    />
                  ) : item.name === 'Pool bar' ? (
                    <img
                      alt="swimming pool icon"
                      src={PoolBarIcon}
                      width={102}
                      height={124}
                    />
                  ) : (
                    <FcIcons8Cup size="sm" />
                  )}
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
        petitStock
          .filter((el) => el.selling === 'selling')
          .map((item, i) => {
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
      )}
    </div>
  )
}

export default AllPetitStock
