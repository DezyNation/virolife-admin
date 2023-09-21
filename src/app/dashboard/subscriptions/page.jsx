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
  Td,
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

  const [referralData, setReferralData] = useState([])

  useEffect(() => {
    fetchSubscriptions()
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
        fetchReferrals()
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err.message,
        });
      });
  }

  function fetchReferrals() {
    BackendAxios.get(
      `/api/admin/referral-info${
        Formik.values.userId ? `/${Formik.values.userId}` : ""
      }`
    )
      .then((res) => {
        setReferralData(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Err while fetching referral data",
          description:
            err?.response?.data?.message || err?.response?.data || err.message,
        });
      });
  }

  function calculateSum(arrObj){
    const sum = arrObj?.reduce((total, currentObject) => {
      return total + parseInt(currentObject?.health_points);
    }, 0);
    return sum
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
      <HStack w={'full'} justifyContent={'space-between'}>
      <Text>Viro Team Subscription Data</Text>
      <Text>Total Points: ₹{calculateSum(data)}</Text>
      </HStack>
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
                <Td>{data?.plan_name}</Td>
                <Td>{data?.health_points}</Td>
                <Td>{data?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <br /><br /><br />
      <HStack w={'full'} justifyContent={'space-between'}>
      <Text>Viro Team Referral Data</Text>
      <Text>Total Points: ₹{calculateSum(referralData)}</Text>
      </HStack>
      <br />
      <TableContainer>
        <Table colorScheme="yellow">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Referred By</Th>
              <Th>Plan Purchased By</Th>
              <Th>Plan</Th>
              <Th>Points Received</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {referralData?.map((data, key) => (
              <Tr>
                <Td>{key + 1}</Td>
                <Td></Td>
                <Td>{data?.beneficiary_id}-{data?.beneficiary_name}</Td>
                <Td>{data?.user_id}-{data?.user_name}</Td>
                <Td>{data?.plan_name}</Td>
                <Td>{data?.health_points}</Td>
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
