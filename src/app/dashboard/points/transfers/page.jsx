"use client";
import React, { useState } from "react";
import {
  Button,
  HStack,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Toast,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import BackendAxios from "@/utils/axios";

const Transactions = () => {
  const [requests, setRequests] = useState([]);
  const [transfers, setTransfers] = useState([]);

  function fetchRequests() {}

  function updateStatus({ transactionId, status }) {
    BackendAxios.post(`/api/admin/approve-points`, {
      transactionId: transactionId,
      status: status,
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Request updated!",
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
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
        Transactions
      </Text>
      <Stack
        w={"full"}
        direction={["column", "row"]}
        justifyContent={"space-between"}
        gap={8}
      >
        <TableContainer rounded={"16"} flex={["unset", 3]}>
          <Table variant={"striped"} colorScheme="gray">
            <TableCaption>
              <Link href={"#"}>Point Transfer Requests (Pending)</Link>
            </TableCaption>
            <Thead bgColor={"yellow.400"}>
              <Tr>
                <Th>#</Th>
                <Th>Trnxn ID</Th>
                <Th>Payee Name</Th>
                <Th>Ponits</Th>
                <Th>Beneficiary</Th>
                <Th>Requested At</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {requests.map((item, key) => (
                <Tr fontSize={"xs"} key={key}>
                  <Td>{key + 1}</Td>
                  <Td> </Td>
                  <Td></Td>
                  <Td> </Td>
                  <Td> </Td>
                  <Td> </Td>
                  <Td>
                    <HStack>
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="yellow"
                        onClick={() => {
                          updateStatus({
                            transactionId: item?.transactionId,
                            status: 1,
                          });
                        }}
                      >
                        Approve
                      </Button>
                      <Button size={"sm"} rounded={"full"} colorScheme="red">
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
      <br />
      <br />
      <TableContainer rounded={"16"} py={6}>
        <Table variant={"striped"} colorScheme="gray">
          <TableCaption>Point Transfer Requests (All)</TableCaption>
          <Thead bgColor={"yellow.400"}>
            <Tr>
              <Th>#</Th>
              <Th>Trnxn ID</Th>
              <Th>Payee Name</Th>
              <Th>Ponits</Th>
              <Th>Beneficiary</Th>
              <Th>Requested At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transfers.map((item, key) => (
              <Tr fontSize={"xs"} key={key}>
                <Td>{key + 1}</Td>
                <Td> </Td>
                <Td> </Td>
                <Td> </Td>
                <Td></Td>
                <Td> </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Transactions;
