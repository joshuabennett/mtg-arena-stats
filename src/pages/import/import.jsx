// Import form
import React from "react";
import "./import.scss";

import ImportForm from "../../components/import-form/import-form";

const ImportPage = (props) => (
  <div className="import-page">
    <ImportForm
      user={props.user}
      set={props.set}
      displayName={props.displayName}
    />
  </div>
);

export default ImportPage;
