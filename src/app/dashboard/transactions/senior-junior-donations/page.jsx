"use client";
import BackendAxios from "@/utils/axios";
import {
  Box,
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
  Button
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";

const page = () => {
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([new Date(), new Date()]);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    BackendAxios.get(
      `api/admin/senior-donated-to-juniors?from=${dates[0]}&to=${dates[1]}`
    )
      .then((res) => {})
      .catch((err) => {});
  }

  return (
    <>
      <Text fontSize={"2xl"}>Senior to Junior Donations</Text>
      <HStack w={["full", "xs"]}>
        <Box>
          <FormLabel>Dates:</FormLabel>
          <RangeDatepicker selectedDates={dates} onDateChange={setDates} />
        </Box>
        <Button onClick={fetchData} colorScheme="yellow">
          Search
        </Button>
      </HStack>
      <br />
      <br />
      <br />
      <TableContainer height={"lg"} overflowY={"scroll"}>
        <Table variant={"striped"} colorScheme="yellow" size={"sm"}>
          <Thead>
            <Tr>
              <Th>Trnxn ID</Th>
              <Th>Donor</Th>
              <Th>Donor Level</Th>
              <Th>Receiver</Th>
              <Th>Receiver Level</Th>
              <Th>Amount</Th>
              <Th>Approved</Th>
              <Th>Timestamp</Th>
              <Th>Updated At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, key) => (
              <Tr key={key}>
                <Td>{item?.id}</Td>
                <Td>
                  {item?.user_name} ({item?.user_id})
                </Td>
                <Td>
                  {item?.sender_round}
                </Td>
                <Td>
                  {item?.user_name} ({item?.user_id})
                </Td>
                <Td>
                  {item?.receiver_round}
                </Td>
                <Td>₹ {item?.amount}</Td>
                <Td>
                  {!item?.approved ? <BsCheckCircleFill color="green" /> : null}
                </Td>
                <Td>{new Date(item?.created_at).toLocaleString()}</Td>
                <Td>{new Date(item?.updated_at).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
