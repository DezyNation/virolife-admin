"use client";
import React, { useEffect, useState } from "react";
import { Text, Stack, Box, useToast } from "@chakra-ui/react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  BsCashCoin,
  BsCurrencyRupee,
  BsMegaphoneFill,
  BsPersonFill,
} from "react-icons/bs";
import BackendAxios from "@/utils/axios";
import Cookies from "js-cookie";

const DashboardHome = () => {
  const Toast = useToast({ position: "top-right" });
  const [overviewData, setOverviewData] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    BackendAxios.get("/api/admin/overview")
      .then((res) => {
        setOverviewData(res.data);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          localStorage.clear();
          Cookies.remove("jwt");
          setTimeout(() => {
            window.location.replace("/auth");
          }, 500);
        }
        console.log(err);
      });
  }, []);

  useEffect(() => {
    BackendAxios.get(`/api/content`)
      .then((res) => {
        const parsedData = JSON.parse(res.data[0]?.content);
        setMsg(parsedData?.adminBroadcast);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }, []);

  return (
    <>
      <Text
        className="serif"
        fontSize={"xl"}
        py={4}
        textTransform={"capitalize"}
      >
        Welcome Admin
      </Text>
      <Stack
        w={"full"}
        direction={["column", "row"]}
        gap={[8, 16]}
        justifyContent={"space-between"}
      >
        <StatsCard
          icon={<BsPersonFill size={28} />}
          title={"Total Users"}
          quantity={overviewData[0]?.count}
        />
        <StatsCard
          icon={<BsMegaphoneFill size={28} />}
          title={"active campaigns"}
          quantity={overviewData[1]?.count}
        />
        <StatsCard
          icon={<BsCurrencyRupee size={28} />}
          title={"total collected"}
          quantity={overviewData?.collection}
        />
        <StatsCard
          icon={<BsCashCoin size={28} />}
          title={"pending payouts"}
          quantity={overviewData?.pending_amount}
        />
      </Stack>
      {msg ? (
        <Box
          mt={16}
          p={4}
          bgColor={"yellow.50"}
          border={"1px solid"}
          borderColor={"yellow.300"}
          rounded={4}
        >
          <Text fontWeight={"semibold"}>Important Message: </Text>
          <Text>{msg}</Text>
        </Box>
      ) : null}
    </>
  );
};

export default DashboardHome;
