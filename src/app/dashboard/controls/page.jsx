"use client";
import { Box, Button, HStack, Input, Switch, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";

const page = () => {
  const Formik = useFormik({
    initialValues: {
      telegramLink: "",
      whatsappLink: "",
      telegramStatus: "",
      whatsappStatus: "",
    },
    onSubmit: values => {
        console.log(values);
    }
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
        <Input name="telegramLink" flex={3} onChange={Formik.handleChange} />
      </HStack>
      <HStack py={4}>
        <Text flex={2}>Telegram Status</Text>
        <Box flex={3}>
          <Switch name="telegramStatus" onChange={Formik.handleChange} />
        </Box>
      </HStack>
      <HStack py={4}>
        <Text flex={2}>Whatsapp Link</Text>
        <Input name="whatsappLink" flex={3} onChange={Formik.handleChange} />
      </HStack>
      <HStack py={4}>
        <Text flex={2}>Whatsapp Status</Text>
        <Box flex={3}>
          <Switch name="whatsappStatus" onChange={Formik.handleChange} />
        </Box>
      </HStack>
      <br /><br />
      <HStack justifyContent={'flex-end'}>
            <Button colorScheme="yellow">Save</Button>
      </HStack>
    </>
  );
};

export default page;
