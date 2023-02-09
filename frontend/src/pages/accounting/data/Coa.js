import { useQuery } from "react-query";
import { useCoasData } from "../../../config/hooks/accounting/coaHook";

const Coa = () => {
  const { data, isSuccess } = useQuery("coas", useCoasData);

  if (isSuccess) {
    console.log(data);
  }

  return <div>Coa</div>;
};

export default Coa;
