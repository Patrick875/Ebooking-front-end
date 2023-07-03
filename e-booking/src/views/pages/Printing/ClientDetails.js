const ClientDetails = (props) => {
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
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default ClientDetails
