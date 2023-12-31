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
  const [agentData, setAgentData] = useState([]);

  useEffect(() => {
    fetchData("distributor");
    fetchData("agent");
  }, []);

  function fetchData(role) {
    BackendAxios.get(`/api/admin/agent-commission/${role}?userId=${userId}`)
      .then((res) => {
        if (role == "distributor") setData(res.data);
        if (role == "agent") setAgentData(res.data);
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

  function calculateSum(arrayOfObjects){
    const sum = arrayOfObjects?.reduce((total, currentObject) => {
      return total + parseInt(currentObject?.credit);
    }, 0);
    return sum
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
      <br />
      <br />
      <HStack w={'full'} justifyContent={'space-between'}>
        <Text>Distributor Data</Text>
        <Text>Total Commission: ₹{calculateSum(agentData)}</Text>
      </HStack>
      <br />
      <TableContainer height={"lg"} overflowY={"scroll"}>
        <Table size={'sm'}>
          <Thead>
            <Tr>
              <Td>#</Td>
              {/* <Td>Agent</Td> */}
              <Td>Distributor</Td>
              <Td>Amount</Td>
              <Td>User</Td>
              <Td>Plan</Td>
              <Td>Timestamp</Td>
            </Tr>
          </Thead>
          <Tbody>
            {agentData?.map((item, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                {/* <Td>
                  {item?.role_name == "agent" && item?.user_id}-
                  {item?.role_name == "agent" && item?.user_name}
                </Td> */}
                <Td>
                  {item?.user_id}-{item?.user_name}
                </Td>
                <Td>₹{item?.credit}</Td>
                <Td>
                  {item?.subscriber_id}-{item?.subscriber_name}
                </Td>
                <Td>{item?.plan_name}</Td>
                <Td>
                  {item?.created_at &&
                    new Date(item?.created_at).toLocaleString(undefined, {
                      timeZone: "Asia/Kolkata",
                    })}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <br />
      <HStack w={'full'} justifyContent={'space-between'}>
        <Text>Agent Data</Text>
        <Text>Total Commission: ₹{calculateSum(data)}</Text>
      </HStack>
      <br />
      <TableContainer height={"lg"} overflowY={"scroll"}>
        <Table size={'sm'}>
          <Thead>
            <Tr>
              <Td>#</Td>
              <Td>Agent</Td>
              {/* <Td>Distributor</Td> */}
              <Td>Amount</Td>
              <Td>User</Td>
              <Td>Plan</Td>
              <Td>Timestamp</Td>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((item, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>
                  {item?.user_id}-{item?.user_name}
                </Td>
                {/* <Td>
                  {item?.role_name == "distributor" && item?.user_id}-
                  {item?.role_name == "distributor" && item?.user_name}
                </Td> */}
                <Td>₹{item?.credit}</Td>
                <Td>
                  {item?.subscriber_id}-{item?.subscriber_name}
                </Td>
                <Td>{item?.plan_name}</Td>
                <Td>
                  {item?.created_at &&
                    new Date(item?.created_at).toLocaleString(undefined, {
                      timeZone: "Asia/Kolkata",
                    })}
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
