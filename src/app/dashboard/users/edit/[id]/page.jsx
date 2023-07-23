"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import { useFormik } from "formik";
import { useCookies } from "react-cookie";
import { isExpired } from "react-jwt";
import BackendAxios, { FormAxios } from "@/utils/axios";

const Info = ({ params }) => {
  const Toast = useToast({ position: "top-right" });
  const { id } = params;
  const [gender, setGender] = useState("");
  const [authUser, setAuthUser] = useState({});
  const [addressObj, setAddressObj] = useState({
    line: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [cookies] = useCookies(["jwt"]);

  const Formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: gender,
      dob: "",
      phone: "",
      email: "",
      attachment1: null,
      attachment2: null,
      accountNumber: "",
      bankName: "",
      micr: "",
      ifsc: "",
      upi: "",
      address: "",
    },
    onSubmit: (values) => {
      FormAxios.put(`/user/${id}`, {
        ...values,
        address: JSON.stringify(addressObj),
        name:
          values.firstName +
          (values.middleName && values.lastName
            ? ` ${values.middleName} ${values.lastName}`
            : !values.middleName && values.lastName && ` ${values.lastName}`),
      })
        .then((res) => {
          Toast({
            status: "success",
            description: "Data updated successfully!",
          });
        })
        .catch((err) => {
          Toast({
            status: "error",
            description:
              err?.response?.data?.message ||
              err?.response?.data ||
              err?.message,
          });
        });
    },
  });

  useEffect(() => {
    if (!isExpired(cookies.jwt)) {
      fetchInfo();
      return;
    }
    if (isExpired(cookies.jwt)) {
      window.location.replace("/");
    }
  }, [cookies]);

  function fetchInfo() {
    BackendAxios.get(`/api/users/${id}`)
      .then((res) => {
        setAuthUser(res.data[0]);
        const address = res.data[0].address ? JSON.parse(res.data[0].address) : addressObj;
        Formik.setFieldValue("firstName", res.data[0]?.name?.split(" ")[0]);
        if (res.data[0]?.name?.split(" ")?.length >= 3)
          Formik.setFieldValue("middleName", res.data[0]?.name?.split(" ")[1]);
        if (res.data[0]?.name?.split(" ")?.length >= 3)
          Formik.setFieldValue("lastName", res.data[0]?.name?.split(" ")[2]);
        if (res.data[0]?.name?.split(" ")?.length >= 2)
          Formik.setFieldValue("lastName", res.data[0]?.name?.split(" ")[1]);
        Formik.setFieldValue("dob", res.data[0]?.dob);
        Formik.setFieldValue("gender", res.data[0]?.gender);
        Formik.setFieldValue("phone", res.data[0]?.phone_number);
        Formik.setFieldValue("email", res.data[0]?.email);
        Formik.setFieldValue("upi", res.data[0]?.upi_id);
        Formik.setFieldValue("ifsc", res.data[0]?.ifsc);
        Formik.setFieldValue("bankName", res.data[0]?.bank_name);
        Formik.setFieldValue("accountNumber", res.data[0]?.account_number);
        Formik.setFieldValue("micr", res.data[0]?.micr);
        setAddressObj({
          line: address?.line,
          city: address?.city,
          state: address?.state,
          pincode: address?.pincode,
          landmark: address?.landmark,
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
      <form action="#" onSubmit={Formik.handleSubmit}>
        <Box p={8}>
          <Stack
            w={"full"}
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"flex-start"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  FIRST NAME
                </FormLabel>
                <Input
                  name="firstName"
                  value={Formik.values.firstName}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  MIDDLE NAME
                </FormLabel>
                <Input
                  name="middleName"
                  value={Formik.values.middleName}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  LAST NAME
                </FormLabel>
                <Input
                  name="lastName"
                  value={Formik.values.lastName}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>

          <Stack
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"flex-start"}
          >
            <Box w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                GENDER
              </FormLabel>
              <HStack gap={4} w={["full", "xs"]}>
                <Button
                  rounded={"full"}
                  colorScheme="yellow"
                  onClick={() => setGender("male")}
                  variant={gender == "male" ? "solid" : "outline"}
                >
                  M
                </Button>
                <Button
                  rounded={"full"}
                  colorScheme="yellow"
                  onClick={() => setGender("female")}
                  variant={gender == "female" ? "solid" : "outline"}
                >
                  F
                </Button>
                <Button
                  rounded={"full"}
                  colorScheme="yellow"
                  onClick={() => setGender("others")}
                  variant={gender == "others" ? "solid" : "outline"}
                >
                  O
                </Button>
              </HStack>
            </Box>

            <Box gap={4} w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                date of birth
              </FormLabel>
              <Input
                bg={"blanchedalmond"}
                w={["full", "xs"]}
                type="date"
                name="dob"
                value={Formik.values.dob}
                onChange={Formik.handleChange}
              />
            </Box>
          </Stack>

          <Stack
            w={"full"}
            gap={8}
            pb={16}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                CONTACT NO
              </FormLabel>
              <HStack>
                <Input
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                  name="phone"
                  value={Formik.values.phone}
                  onChange={Formik.handleChange}
                />
                <Text cursor={"pointer"}>Verify</Text>
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                EMAIL ID
              </FormLabel>
              <HStack>
                <Input
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                  name="email"
                  value={Formik.values.email}
                />
              </HStack>
            </FormControl>
          </Stack>

          <Text fontSize={"lg"} pb={8}>
            BANKING DETAILS
          </Text>
          <Stack
            w={"full"}
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  ACCOUNT NUMBER
                </FormLabel>
                <Input
                  name="accountNumber"
                  value={Formik.values.accountNumber}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  BANK NAME
                </FormLabel>
                <Input
                  name="bankName"
                  value={Formik.values.bankName}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  IFSC
                </FormLabel>
                <Input
                  name="ifsc"
                  value={Formik.values.ifsc}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>
          <Stack
            w={"full"}
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  UPI ID
                </FormLabel>
                <Input
                  name="upi"
                  value={Formik.values.upi}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  MICR (optional)
                </FormLabel>
                <Input
                  name="micr"
                  value={Formik.values.micr}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>

          <Text fontSize={"lg"} pb={8}>
            ADDRESS
          </Text>
          <FormControl w={"full"} pb={8}>
            <Box w={"full"}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                Street
              </FormLabel>
              <Input
                name="street"
                value={addressObj.line}
                onChange={(e) =>
                  setAddressObj({ ...addressObj, line: e.target.value })
                }
                bg={"blanchedalmond"}
                w={["full", "full"]}
              />
            </Box>
          </FormControl>
          <Stack
            w={"full"}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  Landmark
                </FormLabel>
                <Input
                  name="landmark"
                  value={addressObj.landmark}
                  onChange={(e) =>
                    setAddressObj({ ...addressObj, landmark: e.target.value })
                  }
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  City
                </FormLabel>
                <Input
                  name="city"
                  value={addressObj.city}
                  onChange={(e) =>
                    setAddressObj({ ...addressObj, city: e.target.value })
                  }
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  State
                </FormLabel>
                <Input
                  name="state"
                  value={addressObj.state}
                  onChange={(e) =>
                    setAddressObj({ ...addressObj, state: e.target.value })
                  }
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>
          <br />
          <Stack
            w={"full"}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  Pin Code
                </FormLabel>
                <Input
                  name="pincode"
                  value={addressObj.pincode}
                  onChange={(e) =>
                    setAddressObj({ ...addressObj, pincode: e.target.value })
                  }
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>

          <br />
          <br />
          <Stack
            w={"full"}
            pb={16}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                UPLOAD PDF
              </FormLabel>
              <HStack>
                <Input
                  type="file"
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                  name="attachment1"
                  onChange={(e) =>
                    Formik.setFieldValue(
                      "attachment1",
                      e.currentTarget.files[0]
                    )
                  }
                />
                <Input
                  type="file"
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                  name="attachment2"
                  onChange={(e) =>
                    Formik.setFieldValue(
                      "attachment2",
                      e.currentTarget.files[0]
                    )
                  }
                />
              </HStack>
            </FormControl>
          </Stack>

          <HStack justifyContent={"flex-end"}>
            <Button
              colorScheme="yellow"
              type="submit"
            >
              Update
            </Button>
          </HStack>
        </Box>
      </form>
    </>
  );
};

export default Info;
