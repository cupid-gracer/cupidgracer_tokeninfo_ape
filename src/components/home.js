import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SAFEMOONTokenAddress } from "../constants/constant";

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    history.push("/token/" + SAFEMOONTokenAddress);
  }, []);

  return <div></div>;
}
