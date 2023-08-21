"use client";
import BackendAxios from "@/utils/axios";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const Formik = useFormik({
    initialValues: {
      from: "",
      to: "",
      userId: "",
    },
  });

  function fetchSubscriptions() {
    BackendAxios.get(
      `/api/admin/subscription-info${
        Formik.values.userId ? `/${Formik.values.userId}` : ""
      }`
    )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err.message,
        });
      });
  }

  return (
    <>
      <Text fontSize={"lg"}>Viro Team Subscriptions</Text>
      <br />
      <br />
      <Stack
        direction={["column", "row"]}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={8}
      >
        <FormControl w={["full", "xs"]}>
          <FormLabel>From</FormLabel>
          <Input
            bgColor={"white"}
            type="date"
            name="from"
            onChange={Formik.handleChange}
          />
        </FormControl>

        <FormControl w={["full", "xs"]}>
          <FormLabel>To</FormLabel>
          <Input
            bgColor={"white"}
            type="date"
            name="to"
            onChange={Formik.handleChange}
          />
        </FormControl>

        <FormControl w={["full", "xs"]}>
          <FormLabel>User ID</FormLabel>
          <Input
            bgColor={"white"}
            name="userId"
            onChange={Formik.handleChange}
          />
        </FormControl>
      </Stack>
      <HStack py={4} justifyContent={"flex-end"}>
        <Button colorScheme="yellow" onClick={() => fetchSubscriptions()}>
          Search
        </Button>
      </HStack>
      <br />
      <br />
      <TableContainer>
        <Table colorScheme="yellow">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>User ID</Th>
              <Th>User Name</Th>
              <Th>Parent ID</Th>
              <Th>Plan Purchased</Th>
              <Th>Points Received</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((data, key) => (
              <Tr>
                <Td>{key + 1}</Td>
                <Td>{data?.user_id}</Td>
                <Td>{data?.user_name}</Td>
                <Td>{data?.parent_id}</Td>
                <Td>{data?.name}</Td>
                <Td>{data?.points}</Td>
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