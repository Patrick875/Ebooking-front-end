const ClientDetails = (props) => {
  const { details, request } = props
  return (
    <div className="col d-flex flex-row border border-2">
      <div className="col p-2">
        <div>
          {request ? (
            <p className="fw-bolder text-capitalize ">
              {request.clientType} : {request.clientName}
            </p>
          ) : null}

          <p>
            Function:{' '}
            {details.map((el, i, arr) =>
              i !== arr.length - 1 ? `${el.name},` : ` and ${el.name}`,
            )}
          </p>
          <p>
            Number of Pax:{' '}
            {details.map((el, i, arr) =>
              i !== arr.length - 1 ? `${el.times},` : `${el.times}`,
            )}
          </p>
        </div>
        {request ? (
          <p className="col-4 my-2">
            <span className="fw-bold">DATE : </span>{' '}
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default ClientDetails
