import React, { useEffect, useState } from 'react'
import Step1 from '../AddPackageSteps/Step1'
import Step2 from '../AddPackageSteps/Step2'
import Step3 from '../AddPackageSteps/Step3'
import { MultiStepProgressBar } from '../AddPackageSteps/ProgressBar'
import { CButton } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { setFormData } from 'src/redux/MultiStepForm/formActions'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

function AdminProductAdd(props) {
  const {
    categories,
    category,
    setCategory,
    register,
    stockItems,
    getValues,
    reset,
    watch,
    packageItems,
    setPackageItems,
  } = props
  const [step, setStep] = useState(1)
  let formData = useSelector((state) => state.multiStepForm.formData)
  let data = getValues()
  const [productPackages, setProductPackages] = useState([])
  let [packages, setPackages] = useState([])
  const dispatch = useDispatch()

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleNext = async () => {
    if (step === 3) {
      await instance
        .post('/products/add', formData)
        .then(() => {
          toast.success('Product created')
        })
        .catch(() => {
          console.log('Product add failed')
        })
    } else {
      setStep((prev) => prev + 1)
      dispatch(setFormData({ ...data, packages: productPackages }))
    }
  }
  useEffect(() => {
    const getPackages = async () => {
      await instance
        .get('/packages/all')
        .then((res) => {
          setPackages(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getPackages()
  }, [])
  return (
    <div className="m-3">
      <MultiStepProgressBar step={step} />
      <div className="my-2">
        {step === 1 && (
          <Step1
            categories={categories}
            category={category}
            setCategory={setCategory}
            register={register}
            watch={watch}
          />
        )}
        {step === 2 && (
          <Step2
            register={register}
            getValues={getValues}
            reset={reset}
            stockItems={stockItems}
            packageItems={packageItems}
            setPackageItems={setPackageItems}
            category={category}
            productPackages={productPackages}
            setProductPackages={setProductPackages}
            packages={packages}
            setPackages={setPackages}
          />
        )}
        {step === 3 && (
          <Step3
            getValues={getValues}
            packageItems={packageItems}
            category={category}
            productPackages={productPackages}
            packages={packages}
            setPackages={setPackages}
          />
        )}

        <div className="d-flex my-2 justify-content-between">
          {step && step - 1 !== 0 ? (
            <CButton className="btn btn-secondary" onClick={() => handleBack()}>
              Back
            </CButton>
          ) : null}
          <CButton
            className="btn btn-primary"
            onClick={() => {
              return handleNext()
            }}
          >
            {step === 3 ? 'Submit' : 'Next'}
          </CButton>
        </div>
      </div>
    </div>
  )
}

export default AdminProductAdd
