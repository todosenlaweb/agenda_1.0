import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Services = ({ services, subServices }) => {
  return (
    <div id="servicios" className="container my-5">
      <h2 className="mb-4">Servicios Ofrecidos</h2>
        {services?.map((services) => (
          <div className="d-inline-flex px-2 me-1 rounded-3 model-special-tag" key={services}>{services}</div>
        ))}
        {subServices?.map((subServices) => (
          <div key={subServices?.name}>
            <h4 className="mt-3">{subServices?.name}</h4>
            {subServices?.list.map((list) => (
              <div className=" d-inline-flex px-2 me-1 mb-1 rounded-3 model-tag" key={list}>{list}</div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Services;
