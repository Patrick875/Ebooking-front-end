const ClientDetailsProForma = (props) => {
  const { request } = props
  return (
    <div className="col d-flex flex-row border border-2 border-dark">
      <div className="col p-2 my-0">
        <div className="my-0">
          {request ? (
            <p className="fw-bolder text-capitalize my-0">
              {request.clientType} : {request.clientName}
            </p>
          ) : null}
          <p className="my-0">Function: {request.function}</p>
          <p className="my-0">Number of Pax:{request.pax}</p>
        </div>
        {request ? (
          <p className="col-4 my-0">
            <span className="fw-bold">DATE : </span>{' '}
            {new Date(request.createdAt).toLocaleDateString('fr-FR')}
          </p>
        ) : null}
      </div>

      <div className="my-0 mx-2">
        <p className="fw-bold my-0 py-0">
          Expected Date of Arrival :{' '}
          <span className="fw-normal">
            {request.dateIn
              ? new Date(request.dateIn).toLocaleDateString('fr-FR')
              : null}
          </span>
        </p>
        <p className="fw-bold my-0 py-0">
          Expected Date of Departure :{' '}
          <span className="fw-normal">
            {request.dateOut
              ? new Date(request.dateOut).toLocaleDateString('fr-FR')
              : null}
          </span>
        </p>
      </div>
    </div>
  )
}

export default ClientDetailsProForma
