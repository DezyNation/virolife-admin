"use client";
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
    BackendAxios.get(`/api/admin/agent-commission/${userId}`)
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

  return (
    <>
      <Text fontSize={"lg"} fontWeight={"semibold"}>
        Commission Distribution
      </Text>
      <br />
      <HStack py={4} justifyContent={"flex-end"}>
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
      </HStack>
      <br />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Td>#</Td>
              <Td>Agent</Td>
              <Td>DistdTdibutor</Td>
              <Td>Amount</Td>
              <Td>User</Td>
              <Td>Plan</Td>
              <Td>Timestamp</Td>
            </Tr>
          </Thead>
          <Tbody>
            {
              data?.map((item, key) => (
                <Tr key={key}>
                  <Td>{key + 1}</Td>
                  <Td>{item?.agent_id}-{item?.agent_name}</Td>
                  <Td>{item?.distributor_id}-{item?.distributor_name}</Td>
                  <Td>{item?.amount}-{item?.amount}</Td>
                  <Td>{item?.user_id}-{item?.user_name}</Td>
                  <Td>Plan {item?.plan_name}</Td>
                  <Td>{item?.created_at}</Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
