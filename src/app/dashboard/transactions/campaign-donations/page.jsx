"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Box,
  Button,
  FormLabel,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";

const page = () => {
  const { handleError } = useApiHandler();
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([
    new Date().setMonth(new Date().getMonth() - 2),
    new Date().setDate(new Date().getDate() + 1),
  ]);
  const [campaignId, setCampaignId] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchData();
    fetchCampaigns();
  }, []);

  function fetchData() {
    const from = format(dates[0], "yyyy-MM-dd");
    const to = format(dates[1], "yyyy-MM-dd");
    BackendAxios.get(
      `/api/admin/campaign-donations?from=${from}&to=${to}&campaignId=${campaignId}`
    )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching donations");
      });
  }

  function fetchCampaigns() {
    BackendAxios.get("/api/campaign")
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while getting list of campaigns");
      });
  }

  return (
    <>
      <Text fontSize={"2xl"}>Campaign Donations</Text>
      <br />
      <HStack w={["full", "max-content"]} alignItems={"flex-end"}>
        <Box w={["full", "xs"]}>
          <FormLabel>Dates:</FormLabel>
          <RangeDatepicker selectedDates={dates} onDateChange={setDates} />
        </Box>
        <Box w={["full", "xs"]}>
          <FormLabel>Campaign</FormLabel>
          <Select onChange={(e) => setCampaignId(e.target.value)}>
            {campaigns?.map((item, key) => (
              <option key={key} value={item?.id}>
                {item?.title}
              </option>
            ))}
          </Select>
        </Box>
        <Button onClick={fetchData} colorScheme="yellow">
          Search
        </Button>
      </HStack>
      <br />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Trnxn ID</Th>
              <Th>Campaign</Th>
              <Th>Amount</Th>
              <Th>User</Th>
              <Th>Name</Th>
              <Th>Phone Number</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((data, key) => (
              <Tr key={key}>
                <Td>{data?.transaction_id}</Td>
                <Td>
                  ({data?.campaign_id})-{data?.title}
                </Td>
                <Td>₹{data?.amount}</Td>
                <Td>{data?.user_id ? `VCF${data?.user_id}` : ""}</Td>
                <Td>{data?.name}</Td>
                <Td>{data?.phone_number}</Td>
                <Td>{data?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
