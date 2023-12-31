"use client";
import React, { useEffect, useState } from "react";
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
  Tr,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import BackendAxios from "@/utils/axios";
import PrintButtons from "@/components/dashboard/PrintButtons";

const Transactions = () => {
  const [requests, setRequests] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const Toast = useToast({
    position: "top-right",
  });

  useEffect(() => {
    fetchRequests();
    fetchTransfers();
  }, []);

  function fetchRequests() {
    BackendAxios.get("/api/admin/points/requests/pending")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          localStorage.clear();
          window.location.assign("/");
          return
        }
        Toast({
          status: "error",
          title: "Error while fetching peding requests",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchTransfers() {
    BackendAxios.get("/api/admin/points/requests/all")
      .then((res) => {
        setTransfers(res.data);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          localStorage.clear();
          window.location.assign("/");
          return
        }
        Toast({
          status: "error",
          title: "Error while fetching peding requests",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function updateStatus({ transactionId, status }) {
    BackendAxios.post(`/api/admin/approve-points/${transactionId}`, {
      transactionId: transactionId,
      status: status,
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Request updated!",
        });
        fetchRequests();
        fetchTransfers();
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          localStorage.clear();
          window.location.assign("/");
        }
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
      <br />
      <HStack justifyContent={"flex-end"} py={4}>
        <Button onClick={fetchRequests}>Reload Data</Button>
      </HStack>
      <PrintButtons keyword={"transfer-request"} bodyParams={{status: "approved"}} fileName={"PointsTransfers(Approved)"} />
      <Stack
        w={"full"}
        direction={["column", "row"]}
        justifyContent={"space-between"}
        gap={8}
      >
        <TableContainer rounded={"16"} flex={["unset", 3]} height={"lg"} overflowY={"scroll"}>
          <Table variant={"striped"} colorScheme="gray" size={'sm'}>
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
                <Tr key={key}>
                  <Td>{key + 1}</Td>
                  <Td>{item?.id}</Td>
                  <Td>
                    {item?.user_name}-{item?.user_id}
                  </Td>
                  <Td>{item?.value}</Td>
                  <Td>
                    {item?.receiver_id}-{item?.receiver_name}
                  </Td>
                  <Td>{item?.created_at}</Td>
                  <Td>
                    <HStack>
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="yellow"
                        onClick={() => {
                          updateStatus({
                            transactionId: item?.id,
                            status: "approved",
                          });
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="red"
                        onClick={() => {
                          updateStatus({
                            transactionId: item?.id,
                            status: "rejected",
                          });
                        }}
                      >
                        Reject
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
      <br />
      <HStack justifyContent={"flex-end"} py={4}>
        <Button onClick={fetchTransfers}>Reload Data</Button>
      </HStack>
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
              <Th>Updated At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transfers.map((item, key) => (
              <Tr fontSize={"xs"} key={key}>
                <Td>{key + 1}</Td>
                <Td>{item?.id}</Td>
                <Td>
                  {item?.user_name}-{item?.user_id}
                </Td>
                <Td>{item?.value}</Td>
                <Td>
                  {item?.receiver_id}-{item?.receiver_name}
                </Td>
                <Td>{item?.updated_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Transactions;
