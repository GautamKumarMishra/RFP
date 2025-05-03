export default function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">Dashboard</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card w-100">
            <div className="card-body">
              <div className="w-100" style={{ display: 'block', width: '100%' }}>
                Welcome to RFP System.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
