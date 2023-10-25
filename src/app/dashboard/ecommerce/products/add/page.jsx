"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Text,
  Box,
  Image,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Textarea,
  HStack,
  Icon,
  useToast,
  Select,
  Stack,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { BsXCircleFill } from "react-icons/bs";
import { FormAxios } from "@/utils/axios";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(async () => {
  const { default: RQ } = await import("react-quill");
  return ({ ...props }) => <RQ {...props} />;
});

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const Toast = useToast({ position: "top-right" });
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    Formik.setFieldValue("files", acceptedFiles);
    const newImages = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages)
      .then((imagePreviews) =>
        setSelectedImages((prevImages) => [...prevImages, ...imagePreviews])
      )
      .catch((error) => console.error("Error reading file:", error));
  }, []);

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    Formik.setFieldValue(
      "files",
      Formik.values.files?.filter((_, i) => i !== index)
    );
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const Formik = useFormik({
    initialValues: {
      name: "",
      files: null,
      description: "",
      longDescription: "",
      categoryId: "",
      minimumPayableAmount: "",
      price: "",
      strikedPrice: "",
      deliveryCharge: "",
      healthPoint: "",
      adPoint: "",
      atpPoint: "",
      giftCardStatus: true,
      status: true,
    },
    onSubmit: (values) => {
      if (values.minimumPayableAmount > values.price) {
        Toast({
          description: "Min. Amount must be less than the price",
        });
        return;
      }
      if (!values.files?.length) {
        Toast({
          description: "You must upload atleast 1 image",
        });
        return;
      }
      setLoading(true);
      FormAxios.post("/api/product", {
        ...values,
        healthPointStatus: values?.healthPointStatus ? 1 : 0,
        adPointStatus: values?.adPointStatus ? 1 : 0,
        atpPointStatus: values?.atpPointStatus ? 1 : 0,
        giftCardStatus: values?.giftCardStatus ? 1 : 0,
        status: values?.status ? 1 : 0,
      })
        .then((res) => {
          setLoading(false);
          Toast({
            status: "success",
            description: "Product added successfully!",
          });
        })
        .catch((err) => {
          setLoading(false);
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
    setIsClient(true);
  }, []);

  return (
    <>
      <Text pb={4} fontSize={"2xl"} fontWeight={"semibold"} className="serif">
        Add New Product
      </Text>
      <br />
      <Stack
        direction={["column", "row"]}
        justifyContent={"space-between"}
        gap={8}
        py={6}
      >
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Select Category</FormLabel>
          <Select
            name="categoryId"
            placeholder="Select Here"
            onChange={(e) => Formik.setFieldValue("categoryId", e.target.value)}
            value={Formik.values.categoryId}
          >
            <option value="1">Medical</option>
            <option value="2">Education</option>
            <option value="3">New Startup</option>
            <option value="4">Sports Help</option>
          </Select>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Min. Payable Amount</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"minimumPayableAmount"}
              onChange={Formik.handleChange}
            />
          </InputGroup>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Display Price</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"price"}
              onChange={Formik.handleChange}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Stack
        direction={["column", "row"]}
        justifyContent={"space-between"}
        gap={8}
        py={6}
      >
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Cancelled Price</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"strikedPrice"}
              onChange={Formik.handleChange}
            />
          </InputGroup>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Shipping Price</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"deliveryCharge"}
              onChange={Formik.handleChange}
            />
          </InputGroup>
        </FormControl>
      </Stack>
      
      <FormControl py={4}>
        <FormLabel>Product Name</FormLabel>
        <Input
          w={"full"}
          variant={"flushed"}
          fontSize={["xl", "2xl", "3xl"]}
          className="serif"
          p={2}
          name="name"
          placeholder="e.g: Set of 6 Notebooks"
          onChange={Formik.handleChange}
        />
      </FormControl>
      <Box p={4}>
        <Text pb={4} fontWeight={"semibold"}>
          Upload Images
        </Text>
        <VStack
          {...getRootProps()}
          w={["full", "lg"]}
          h={"xs"}
          rounded={16}
          border={"1px"}
          borderStyle={"dashed"}
          bg={"#FAFAFA"}
          cursor={"pointer"}
          justifyContent={"center"}
        >
          <Input visibility={"hidden"} {...getInputProps()} />
          {isDragActive ? (
            <Text>Drop Your Files Here...</Text>
          ) : (
            <Text>Click to Upload Or Drop Your Files Here...</Text>
          )}
        </VStack>
        <HStack py={4}>
          {selectedImages.map((image, index) => (
            <Box key={index} pos={"relative"}>
              <Icon
                as={BsXCircleFill}
                color={"red"}
                pos={"absolute"}
                size={12}
                top={0}
                right={0}
                onClick={() => removeImage(index)}
              />
              <Image
                src={image}
                w={36}
                h={36}
                rounded={16}
                objectFit={"cover"}
              />
            </Box>
          ))}
        </HStack>
      </Box>
      <FormControl py={4}>
        <FormLabel>Short Description (15-20 words)</FormLabel>
        <Textarea
          w={"full"}
          name="description"
          onChange={Formik.handleChange}
          placeholder="Brief description about this product"
        ></Textarea>
      </FormControl>
      <FormControl py={4}>
        <FormLabel>Full description</FormLabel>
        {isClient ? (
          <QuillNoSSRWrapper
            theme="snow"
            value={Formik.values.longDescription}
            onChange={(value) => Formik.setFieldValue("longDescription", value)}
            style={{ height: "400px" }}
          />
        ) : null}
      </FormControl>
      <br />
      <br />
      <br />
      <VStack
        w={"full"}
        py={4}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
      >
        <Text fontSize={"lg"} className="serif">
          Which payment methods will be allowed?
        </Text>
        <br />
        <HStack alignItems={"flex-end"} gap={6} wrap={"wrap"}>
          <FormControl maxW={["full", "xs"]}>
            <FormLabel fontSize={"xs"}>Health Points</FormLabel>
            <Input
              type="number"
              name="healthPoint"
              onChange={Formik.handleChange}
            />
          </FormControl>

          <FormControl maxW={["full", "xs"]}>
            <FormLabel fontSize={"xs"}>Ad Points</FormLabel>
            <Input
              type="number"
              name="adPoint"
              onChange={Formik.handleChange}
            />
          </FormControl>

          <FormControl maxW={["full", "xs"]}>
            <FormLabel fontSize={"xs"}>All Team Points</FormLabel>
            <Input
              type="number"
              name="atpPoint"
              onChange={Formik.handleChange}
            />
          </FormControl>

          <FormControl maxW={["full", "xs"]}>
            <FormLabel fontSize={"xs"}>Allow Gift Card</FormLabel>
            <HStack gap={6}>
              <Button
                colorScheme="yellow"
                variant={Formik.values.giftCardStatus ? "solid" : "outline"}
                onClick={() => Formik.setFieldValue("giftCardStatus", true)}
              >
                Yes
              </Button>
              <Button
                colorScheme="yellow"
                variant={!Formik.values.giftCardStatus ? "solid" : "outline"}
                onClick={() => Formik.setFieldValue("giftCardStatus", false)}
              >
                No
              </Button>
            </HStack>
          </FormControl>
        </HStack>
      </VStack>
      <HStack justifyContent={"flex-end"} py={4}>
        {/* <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={() => {
            Formik.setFieldValue("status", false);
            setLoading(true);
            setTimeout(() => {
              Formik.handleSubmit();
            }, 200);
          }}
          variant={"outline"}
        >
          Save as Draft
        </Button> */}
        <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={Formik.handleSubmit}
        >
          Publish
        </Button>
      </HStack>
    </>
  );
};

export default Page;
