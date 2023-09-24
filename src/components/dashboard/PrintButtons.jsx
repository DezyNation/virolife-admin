"use client";
import BackendAxios from "@/utils/axios";
import { Button, HStack, useToast } from "@chakra-ui/react";
import fileDownload from "js-file-download";
import React, { useState } from "react";

const PrintButtons = ({ keyword, queryParams, bodyParams, fileName }) => {
  const Toast = useToast({ position: "top-right" });
  const [isLoading, setIsLoading] = useState(false)

  function handleExport(extension) {
    setIsLoading(true)
    BackendAxios.post(
      `/api/admin/print-reports/${keyword}${queryParams ? `?${queryParams}` : ""}`,
      { ...bodyParams, extension: extension },
      { responseType: "blob" }
    ).then((res) => {
        fileDownload(res.data, `${fileName}.${extension}`)
        setIsLoading(false)
    }).catch(err => {
        setIsLoading(false)
        Toast({
            status: 'error',
            title: "Err while downloading file",
            description: err?.response?.data?.message || err?.response?.data || err?.message
        })
    });
  }

  return (
    <>
      <HStack py={4}>
        <Button colorScheme="red" onClick={()=>handleExport("pdf")} isLoading={isLoading}>
          PDF
        </Button>
        <Button colorScheme="whatsapp" onClick={()=>handleExport("xlsx")} isLoading={isLoading}>
          Excel
        </Button>
      </HStack>
    </>
  );
};

export default PrintButtons;
