import React from "react";
import { useParams } from "react-router";
const Success = () => {
  let { id } = useParams();
  return <div>
    {id!==""?(
      id==="404"?("Failed Uploading"):(
        <a href={"https://www.youtube.com/watch?v="+id}>Video Link</a>
    )):""}
  </div>;
};
export default Success;
