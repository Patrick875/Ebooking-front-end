import { useSelector } from 'react-redux'

const { CCol, CRow, CCard } = require('@coreui/react')

const Step3 = (props) => {
  const formData = useSelector((state) => state.multiStepForm.formData)
  const { getValues, packageItems, productPackages, packages, setPackages } =
    props
  const data = getValues()
  let packageDetails
  console.log('come on', { data: data, productPackages })
  if (
    Object.keys(data).length !== 0 &&
    productPackages &&
    productPackages.length !== 0
  ) {
    packageDetails = {
      name: data.name,
      category: data.category,
      packages: productPackages,
    }
    console.log(packageDetails)
  }
  console.log(formData)

  return (
    <CCol>
      <h4 className="fw-bolder text-center lead">Summary</h4>
      {formData ? (
        <CRow>
          <div className="text-center">
            {formData && Object.keys(formData) ? (
              <p className="text-capitalize lead fw-bolder italic ">
                {' '}
                {formData.name}
              </p>
            ) : null}

            <p className="fw-bold">Packages</p>
          </div>
          <div className="col-3">
            {formData.packages && formData.packages.length !== 0
              ? formData.packages.map((item, i) => (
                  <CCol key={i} className="">
                    <p className="fw-bold text-capitalize">
                      {
                        packages.filter(
                          (el) => el.id === Number(item.packageId),
                        )[0].name
                      }{' '}
                      of {formData.name}
                    </p>
                    <p className="fw-light fst-italic">contains</p>
                    {item.items && item.items.length !== 0 ? (
                      item.items.map((e) => (
                        <p className="fw-semibold fst-italic">
                          {e.quantity} {e.unit} of {e.itemName}
                        </p>
                      ))
                    ) : (
                      <p>no items listed</p>
                    )}
                  </CCol>
                ))
              : null}
          </div>
        </CRow>
      ) : (
        <div>No details</div>
      )}
    </CCol>
  )
}

export default Step3
