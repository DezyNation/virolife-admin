"use client";
import PrintButtons from "@/components/dashboard/PrintButtons";
import BackendAxios from "@/utils/axios";
import {
  Button,
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const [userId, setUserId] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    BackendAxios.get(`/api/admin/all-team-donations`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          localStorage.clear();
          Cookies.remove("jwt");
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          title: "Error while fetching data",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function getMonthsBetweenDates(startDate, endDate) {
    var startYear = startDate.getFullYear();
    var startMonth = startDate.getMonth();
    var endYear = endDate.getFullYear();
    var endMonth = endDate.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  }

  function calculateDonation(stars, starsPerDonation, donationAmount) {
    // Calculate the donation amount based on the given number of stars
    const donation = (stars / starsPerDonation) * donationAmount;
    return donation;
  }

  return (
    <>
      <Text fontSize={"lg"} fontWeight={"semibold"}>
        Donations for All Team Process
      </Text>
      <br />
      <PrintButtons
        keyword={"all-team-donation"}
        bodyParams={{ purpose: "all-team" }}
        fileName={"AllTeamDonation"}
      />
      {/* <HStack py={4} justifyContent={"flex-end"}>
        <HStack w={["full", "xs"]}>
          <Input
            name="userId"
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
            placeholder="Distributor or Agent ID"
          />
          <Button onClick={fetchData} colorScheme="yellow">
            Search
          </Button>
        </HStack>
      </HStack> */}
      <br />
      <TableContainer w={"full"}>
        <Table variant={"striped"} size={"sm"} colorScheme="gray">
          <Thead bgColor={"yellow.400"}>
            <Tr>
              <Th>#</Th>
              <Th>ID</Th>
              <Th>User Name</Th>

              <Th>Stars</Th>
              <Th>Donation Amount</Th>

              <Th>Registered On</Th>
              <Th>Performance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((user, key) => (
              <Tr fontSize={"xs"} key={key}>
                <Td>{key + 1}</Td>
                <Td>VCF{user?.id}</Td>
                <Td className="sticky-left">{user?.name}</Td>
                <Td>{user?.stars}</Td>
                <Td>
                  {user?.amount}
                </Td>
                <Td>{new Date(user?.created_at).toLocaleString()}</Td>
                <Td>
                  {user?.performance}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
