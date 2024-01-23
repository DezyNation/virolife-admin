"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Box,
  Button,
  FormLabel,
  HStack,
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
  const [dates, setDates] = useState([new Date(), new Date()]);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const from = format(dates[0], "yyyy-MM-dd");
    const to = format(dates[1], "yyyy-MM-dd");
    BackendAxios.get(`/api/admin/campaign-donations?from=${from}&to=${to}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching donations");
      });
  }

  return (
    <>
      <Text fontSize={"2xl"}>Campaign Donations</Text>
      <br />
      <HStack w={["full", "lg"]} alignItems={"flex-end"}>
        <Box>
          <FormLabel>Dates:</FormLabel>
          <RangeDatepicker selectedDates={dates} onDateChange={setDates} />
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
                <Td>{data?.amount}</Td>
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
