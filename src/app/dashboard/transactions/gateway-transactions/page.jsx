"use client";
import React, { useState, useEffect } from "react";
import {
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

const Transactions = () => {
  const { handleError } = useApiHandler();
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([new Date(), new Date()])
  const [transactionId, setTransactionId] = useState("")

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    BackendAxios.get(`/api/admin/gateway-transaction/all?transactionId=${transactionId}&from=${dates[0]}&to=${dates[1]}`)
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

      <Stack
        py={4}
        gap={4}
        direction={["column", "row"]}
        alignItems={"flex-end"}
      >
        <HStack w={["full", "xs"]}>
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
        <Button colorScheme="twitter">Search</Button>
      </Stack>

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
