"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Unplug } from "lucide-react";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

export default function Dashboard() {
  const [statuscode, setStatuscode] = useState(300); // Start with null to differentiate initial render
  const [email, setEmail] = useState("");
  const [customerid, setCustomerid] = useState("");
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  useEffect(() => {
    // Fetch the status
    fetch(
      `${
        process.env.BASE_URL || "https://voting-system-gilt.vercel.app/"
      }/server/verify/verify-user-access?data=${data}`
    )
      .then(async (res) => {
        setStatuscode(res.status); // Update the status code
        interface IResponse {
          email: string;
          customerid: string;
        }
        const resObject = (await res.json()) as unknown as IResponse;
        setEmail(resObject.email);
        setCustomerid(resObject.customerid);
        return res.status;
      })
      .then(async (status) => {
        if (status == 403 && document.cookie) {
          const finalData = decodeURIComponent(document.cookie).split("=")[1];
          fetch(
            `${
              process.env.BASE_URL || "http://localhost:3000"
            }/server/verify/verify-user-access?data=${finalData}`
          )
            .then(async (res) => {
              setStatuscode(res.status); // Update the status code
              interface IResponse {
                email: string;
                customerid: string;
              }
              const resObject = (await res.json()) as unknown as IResponse;
              setEmail(resObject.email);
              setCustomerid(resObject.customerid);
            })
            .catch((err) => {
              console.error("Error fetching status:", err);
              setStatuscode(500); // Set status to 500 in case of an error
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching status:", err);
        setStatuscode(500); // Set status to 500 in case of an error
      });
  }, [data]); // Ensure dependencies are added

  if (statuscode === 300 || !email || !customerid || !data) {
    return <div>{email}</div>;
  } else if (statuscode == 200) {
    //set cookies
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = encodeURIComponent(data);
    document.cookie = `jwt=${session}; expires=${expires}; path=/; Secure; SameSite=Lax`;
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <iframe
          title="dashboard"
          src={`https://prod-10.southeastasia.logic.azure.com/workflows/cbb2608e6fc044f89d8884513dd554d3/triggers/manual/paths/invoke/id/${customerid}?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3Cn017IZF3aOJKXx5POG-VHmmk7iyBrgjYI3Ijj8b2E`}
          style={{ flex: 1, border: "none" }}
          allowFullScreen
        ></iframe>
      </div>
    );
  } else if (statuscode == 403 && document.cookie) {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <iframe
          title="cachedDashboard"
          src={`https://prod-10.southeastasia.logic.azure.com/workflows/cbb2608e6fc044f89d8884513dd554d3/triggers/manual/paths/invoke/id/${customerid}?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3Cn017IZF3aOJKXx5POG-VHmmk7iyBrgjYI3Ijj8b2E`}
          style={{ flex: 1, border: "none" }}
          allowFullScreen
        ></iframe>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center w-screen h-screen bg-black text-white font-sans">
        <div className="relative mb-8">
          {/* Email Icon */}
          <div className="flex justify-center items-center bg-black w-[100px] h-[100px] rounded-full border-2 border-white">
            <Unplug className="text-white w-10 h-10" />
          </div>
        </div>

        {/* Text */}
        <p className="text-lg font-medium text-center">
          <strong>Invalid URL.</strong>
          <br /> Please contact administrator to reset your voting access.
        </p>
      </div>
    );
  }
}
