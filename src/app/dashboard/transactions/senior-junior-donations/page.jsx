"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
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
  Button,
  useToast,
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([
    new Date().setMonth(new Date().getMonth() - 2),
    new Date().setDate(new Date().getDate() + 1),
  ]);
  const { handleError } = useApiHandler();

  const now = new Date();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const from = format(dates[0], "yyyy-MM-dd");
    const to = format(dates[1], "yyyy-MM-dd");
    BackendAxios.get(
      `api/admin/senior-donated-to-juniors?from=${from}&to=${to}`
    )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Err while fetching Data");
      });
  }

  function approveDonation(id, approve) {
    BackendAxios.post(`/api/admin/approve/my-senior-donation/${id}`, {
      ...(approve ? { approved: 1 } : { donated: 0, approved: 0 }),
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Donation accepted!",
        });
        window.location.reload(true);
      })
      .catch((err) => {
        handleError(err, "Err while accepting donation");
      });
  }

  return (
    <>
      <Text fontSize={"2xl"}>Senior to Junior Donations</Text>
      <br />
      <br />
      <HStack w={["full", "xs"]} alignItems={"flex-end"}>
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
              {/* <Th>Receiver Level</Th> */}
              <Th>Amount</Th>
              <Th>Donated</Th>
              <Th>Approved</Th>
              <Th>Timestamp</Th>
              <Th>Updated At</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, key) => (
              <Tr key={key}>
                <Td>{item?.id}</Td>
                <Td>
                  {item?.sender_name} ({item?.sender_id})
                </Td>
                <Td>{item?.sender_round}</Td>
                <Td>
                  {item?.receiver_name} ({item?.receiver_id})
                </Td>
                {/* <Td>{item?.receiver_round}</Td> */}
                <Td>₹ {item?.amount}</Td>
                <Td align="center">
                  {item?.donated ? <BsCheckCircleFill color="green" /> : null}
                </Td>
                <Td align="center">
                  {item?.approved ? <BsCheckCircleFill color="green" /> : null}
                </Td>
                <Td>{new Date(item?.created_at).toLocaleString()}</Td>
                <Td>{new Date(item?.updated_at).toLocaleString()}</Td>
                <Td>
                  {now - new Date(item?.created_at) >= 86400000 ? (
                    <HStack gap={6}>
                      {item?.approved ? null : item?.donated ? (
                        <Button
                          size={"sm"}
                          rounded={"full"}
                          colorScheme="yellow"
                          onClick={() => approveDonation(item?.id, true)}
                        >
                          Approve
                        </Button>
                      ) : null}
                      {item?.approved ? null : item?.donated ? (
                        <Button
                          size={"sm"}
                          rounded={"full"}
                          colorScheme="red"
                          onClick={() => approveDonation(item?.id, false)}
                        >
                          Reject
                        </Button>
                      ) : null}
                    </HStack>
                  ) : null}
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
