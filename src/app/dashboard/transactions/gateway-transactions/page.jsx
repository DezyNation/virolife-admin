"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";

const Transactions = () => {
  const { handleError } = useApiHandler();
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([new Date(), new Date()]);
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const from = format(dates[0], "yyyy-MM-dd");
    const to = format(dates[1], "yyyy-MM-dd");
    BackendAxios.get(
      `/api/admin/gateway-transaction/all?transactionId=${transactionId}&from=${from}&to=${to}`
    )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching payments");
      });
  }

  return (
    <>
      <Text
        className="serif"
        fontSize={"2xl"}
        py={4}
        textTransform={"capitalize"}
      >
        Gateway Transactions
      </Text>

      <HStack w={["full", "lg"]} alignItems={"flex-end"}>
        <Box>
          <FormLabel>User ID:</FormLabel>
          <Input
            name="transactionId"
            onChange={(e) => setTransactionId(e.target.value)}
            value={transactionId}
            placeholder="Distributor or Agent ID"
          />
        </Box>
        <Box>
          <FormLabel>Dates:</FormLabel>
          <RangeDatepicker selectedDates={dates} onDateChange={setDates} />
        </Box>
        <Button onClick={fetchData} colorScheme="yellow">
          Search
        </Button>
      </HStack>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Trnxn ID</Th>
              <Th>Description</Th>
              <Th>Amount</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((data, key) => (
              <Tr key={key}>
                <Td>{data?.payment_id}</Td>
                <Td>{data?.purpose}</Td>
                <Td>{data?.amount}</Td>
                <Td>{data?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Transactions;
