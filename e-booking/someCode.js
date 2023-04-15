// if (role === 'admin') {
//   return (
//     <>
//       <CRow>
//         <CCol xs={12}>
//           <CCard className="mb-4">
//             <CCardHeader>
//               <h2 className="text-center">
//                 <strong> Add Product </strong>
//               </h2>
//             </CCardHeader>
//             <CCardBody>
//               <CForm
//                 className="row"
//                 name="roomClassAddFrm"
//                 encType="multipart/form"
//                 onSubmit={handleSubmit(onSubmit)}
//               >
//                 <CCol md={6}>
//                   <CFormLabel htmlFor="title"> Product title </CFormLabel>
//                   <CFormInput
//                     className="mb-1"
//                     type="text"
//                     name="title"
//                     id="title"
//                     size="md"
//                     required
//                     {...register('name')}
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormLabel htmlFor="category"> Product category </CFormLabel>
//                   <CFormSelect
//                     name="category"
//                     id="category"
//                     size="md"
//                     className="mb-3"
//                     aria-label="Room class"
//                     {...register('category', { required: true })}
//                   >
//                     <option>-- Select -- </option>
//                     {allDataCategories && allDataCategories.length !== 0
//                       ? allDataCategories.map((category) => (
//                           <option value={category.id} key={category.id}>
//                             {category.name}
//                           </option>
//                         ))
//                       : null}
//                   </CFormSelect>
//                 </CCol>
//                 <CCol xs={12} className="text-center my-3">
//                   <CButton
//                     component="input"
//                     type="submit"
//                     value=" Save product details"
//                   />
//                 </CCol>
//                 <CCol>
//                   <div>
//                     <CCol md={6}>
//                       <CFormLabel htmlFor="price1" className="col-form-label">
//                         Set price for
//                         <span className="strong"> </span> package
//                       </CFormLabel>
//                     </CCol>
//                     <CCol md="6">
//                       <CFormInput
//                         type="Number"
//                         min="1"
//                         id="price1"
//                         {...register(`package`, {
//                           required: true,
//                         })}
//                       />
//                     </CCol>
//                   </div>

//                   <CCol md={6} key="{itemPackage.id}">
//                     <CFormLabel htmlFor="package">Product packages </CFormLabel>

//                     <CFormCheck
//                       name="{itemPackage.name}"
//                       id="check"
//                       size="md"
//                       label="{itemPackage.name}"
//                       value="{itemPackage.name}"
//                       className="mb-3"
//                       aria-label="{itemPackage.name}"
//                     />
//                   </CCol>
//                   <CCol xs={12} className="text-center my-3">
//                     <CButton
//                       component="input"
//                       type="submit"
//                       value=" Save product"
//                     />
//                   </CCol>
//                 </CCol>
//               </CForm>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </>
//   )
// } else {
//   return (
//     <>
//       <CRow>
//         <CCol xs={12}>
//           <CCard className="mb-4">
//             <CCardHeader>
//               <h2 className="text-center">
//                 <strong> Add Product </strong>
//               </h2>
//             </CCardHeader>
//             <CCardBody>
//               <CForm
//                 className="row"
//                 name="roomClassAddFrm"
//                 encType="multipart/form"
//                 onSubmit={handleSubmit(onManagerSubmit)}
//               >
//                 <CCol md={6}>
//                   <CFormLabel htmlFor="title"> Product title </CFormLabel>
//                   <CFormInput
//                     className="mb-1"
//                     type="text"
//                     name="title"
//                     id="title"
//                     size="md"
//                     required
//                     {...register('name')}
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormLabel htmlFor="category"> Product category </CFormLabel>
//                   <CFormSelect
//                     name="category"
//                     id="category"
//                     size="md"
//                     className="mb-3"
//                     aria-label="Room class"
//                     {...register('category', { required: true })}
//                   >
//                     <option>-- Select -- </option>
//                     {allDataCategories && allDataCategories.length !== 0
//                       ? allDataCategories.map((category) => (
//                           <option value={category.id} key={category.id}>
//                             {category.name}
//                           </option>
//                         ))
//                       : null}
//                   </CFormSelect>
//                 </CCol>
//                 <CCol xs={12} className="text-center my-3">
//                   <CButton
//                     component="input"
//                     type="submit"
//                     value=" Save product details"
//                   />
//                 </CCol>
//               </CForm>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </>
//   )
// }
