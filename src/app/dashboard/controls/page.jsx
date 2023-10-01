"use client";
import BackendAxios from "@/utils/axios";
import {
  Box,
  Button,
  HStack,
  Input,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

const page = () => {
  const Toast = useToast({ position: "top-right" });

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    BackendAxios.get(`/api/content`)
      .then((res) => {
        const parsedData = JSON.parse(res.data[0]);
        Formik.setFieldValue("telegramLink", parsedData?.telegramLink)
        Formik.setFieldValue("whatsappLink", parsedData?.whatsappLink)
        Formik.setFieldValue("telegramStatus", parsedData?.telegramStatus)
        Formik.setFieldValue("whatsappStatus", parsedData?.whatsappStatus)
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  const Formik = useFormik({
    initialValues: {
      telegramLink: "",
      whatsappLink: "",
      telegramStatus: "",
      whatsappStatus: "",
    },
    onSubmit: (values) => {
      BackendAxios.put(`/api/content/1`, {
        content: JSON.stringify(values),
      })
        .then((res) => {
          Toast({
            status: "success",
            title: "Data updated successfully!",
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
  return (
    <>
      <Text fontSize={"lg"} className="messiri" fontWeight={"semibold"}>
        Website Controls
      </Text>
      <br />
      <br />
      <HStack py={4}>
        <Text flex={2}>Telegram Link</Text>
        <Input
          name="telegramLink"
          value={Formik.values.telegramLink}
          flex={3}
          onChange={Formik.handleChange}
        />
      </HStack>
      <HStack py={4}>
        <Text flex={2}>Telegram Status</Text>
        <Box flex={3}>
          <Switch
            name="telegramStatus"
            isChecked={Formik.values.telegramStatus}
            onChange={(e) => Formik.setFieldValue("whatsappStatus", e.target.checked)}
          />
        </Box>
      </HStack>
      <HStack py={4}>
        <Text flex={2}>Whatsapp Link</Text>
        <Input
          name="whatsappLink"
          value={Formik.values.whatsappLink}
          flex={3}
          onChange={Formik.handleChange}
        />
      </HStack>
      <HStack py={4}>
        <Text flex={2}>Whatsapp Status</Text>
        <Box flex={3}>
          <Switch
            name="whatsappStatus"
            isChecked={Formik.values.whatsappStatus}
            onChange={(e) => Formik.setFieldValue("whatsappStatus", e.target.checked)}
          />
        </Box>
      </HStack>
      <br />
      <br />
      <HStack justifyContent={"flex-end"}>
        <Button colorScheme="yellow">Save</Button>
      </HStack>
    </>
  );
};

export default page;
