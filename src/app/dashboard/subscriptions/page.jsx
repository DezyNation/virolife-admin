"use client";
import PrintButtons from "@/components/dashboard/PrintButtons";
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
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([new Date(), new Date()]);

  const [referralData, setReferralData] = useState([]);

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
    const from = format(dates[0], "yyyy-MM-dd");
    const to = format(dates[1], "yyyy-MM-dd");
    BackendAxios.get(
      `/api/admin/subscription-info${
        Formik.values.userId ? `/${Formik.values.userId}` : ""
      }?from=${from}&to=${to}`
    )
      .then((res) => {
        setData(res.data);
        fetchReferrals();
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
    const from = format(dates[0], "yyyy-MM-dd");
    const to = format(dates[1], "yyyy-MM-dd");
    BackendAxios.get(
      `/api/admin/referral-info${
        Formik.values.userId ? `/${Formik.values.userId}` : ""
      }?from=${from}&to=${to}`
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

  function calculateSum(arrObj) {
    const sum = arrObj?.reduce((total, currentObject) => {
      return total + parseInt(currentObject?.health_points);
    }, 0);
    return sum;
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
          <RangeDatepicker selectedDates={dates} onDateChange={setDates} />
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
      <HStack w={"full"} justifyContent={"space-between"}>
        <Text>
          Viro Team Subscription Data{" "}
          {Formik.values.userId && `for User ${Formik.values.userId}`}
        </Text>
        <Text>Total Points: ₹{calculateSum(data)}</Text>
      </HStack>
      <PrintButtons
        keyword={"subscription"}
        bodyParams={{ userId: Formik.values.userId }}
        fileName={`SubscriptionsData${Formik.values.userId}`}
      />
      <br />
      <TableContainer height={"lg"} overflowY={"scroll"}>
        <Table colorScheme="yellow" size={"sm"}>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>User ID</Th>
              <Th>User Name</Th>
              <Th>Senior ID</Th>
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
      <br />
      <br />
      <br />
      <HStack w={"full"} justifyContent={"space-between"}>
        <Text>
          Viro Team Referral Data{" "}
          {Formik.values.userId && `for User ${Formik.values.userId}`}
        </Text>
        <Text>Total Points: ₹{calculateSum(referralData)}</Text>
      </HStack>
      <PrintButtons
        keyword={"referral"}
        bodyParams={{ userId: Formik.values.userId }}
        fileName={`ReferralsData${Formik.values.userId}`}
      />
      <br />
      <TableContainer height={"lg"} overflowY={"scroll"}>
        <Table colorScheme="yellow" size={"sm"}>
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
                <Td>
                  {data?.beneficiary_id}-{data?.beneficiary_name}
                </Td>
                <Td>
                  {data?.user_id}-{data?.user_name}
                </Td>
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
