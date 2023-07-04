import {
  CButton,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardText,
  CCardTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

function CreateHotelEvent() {
  const [halls, setHalls] = useState()
  useEffect(() => {
    const getHalls = async () => {
      await instance
        .get('/halls/all')
        .then((res) => {
          setHalls(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    getHalls()
  }, [])

  return (
    <div className="locations">
      {halls.map((el) => (
        <CCard>
          <CCardBody>
            <CCardTitle className="text-center">{el.name}</CCardTitle>
            <CCardSubtitle className="mb-2 text-medium-emphasis d-flex justify-content-center">
              <CButton>Add</CButton>
            </CCardSubtitle>
            <CCardText>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </CCardText>
          </CCardBody>
        </CCard>
      ))}

      <CCard>
        <CCardBody>
          <CCardTitle className="text-center">Outside Catering 1</CCardTitle>
          <CCardSubtitle className="mb-2 text-medium-emphasis">
            Card subtitle
          </CCardSubtitle>
          <CCardText>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </CCardText>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <CCardTitle className="text-center">Outside Catering 2</CCardTitle>
          <CCardSubtitle className="mb-2 text-medium-emphasis">
            Card subtitle
          </CCardSubtitle>
          <CCardText>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </CCardText>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <CCardTitle className="text-center">Outside Catering 3</CCardTitle>
          <CCardSubtitle className="mb-2 text-medium-emphasis">
            Card subtitle
          </CCardSubtitle>
          <CCardText>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </CCardText>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default CreateHotelEvent
