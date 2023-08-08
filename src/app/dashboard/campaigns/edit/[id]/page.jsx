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
import BackendAxios, { FormAxios } from "@/utils/axios";
import { RangeDatepicker } from "chakra-dayzed-datepicker";

const Page = ({params}) => {
  const Toast = useToast({ position: "top-right" });
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState({})
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({
    type: "myself",
    name: "",
    address: "",
    contact: "",
  });

  const {id} = params

  useEffect(()=>{
    BackendAxios.get(`/api/campaign/${id}`)
      .then((res) => {
        setCampaign(res.data[0]);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  },[])


  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles[0]);
    Formik.setFieldValue("files", acceptedFiles[0]);
    const newImages = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    console.log(newImages);
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
      Formik.values.files.filter((_, i) => i !== index)
    );
  };
  const [selectedImages, setSelectedImages] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const Formik = useFormik({
    initialValues: {
      title: "",
      files: null,
      description: "",
      full_description: "",
      category_id: "",
      target_amount: "",
    },
    onSubmit: () => {
      setLoading(true);
      const formData = new FormData();
      formData.append("files", Formik.values.files);
      formData.append("title", Formik.values.title);
      formData.append("description", Formik.values.description);
      formData.append("full_description", Formik.values.full_description);
      formData.append("category_id", Formik.values.category_id);
      formData.append("target_amount", Formik.values.target_amount);
      formData.append("from", new Date(selectedDates[0]).getUTCSeconds());
      formData.append("to", new Date(selectedDates[1]).getUTCSeconds());
      formData.append("beneficiaryDetails", JSON.stringify(beneficiaryDetails));
      FormAxios.put(`/api/campaign/${id}`, formData)
        .then((res) => {
          setLoading(false);
          Toast({
            status: "success",
            description: "Campaign was updated successfully!",
          });
          console.log(formData);
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

  useEffect(()=>{
    Formik.setFieldValue("target_amount", campaign?.target_amount)
    Formik.setFieldValue("title", campaign?.title)
    Formik.setFieldValue("description", campaign?.description)
    Formik.setFieldValue("full_description", campaign?.full_description)
    Formik.setFieldValue("category_id", campaign?.category?.id)
    if(campaign?.beneficiary_details){
      setBeneficiaryDetails({
        type: JSON.parse(campaign?.beneficiary_details)?.type,
        name: JSON.parse(campaign?.beneficiary_details)?.name,
        address: JSON.parse(campaign?.beneficiary_details)?.address,
        contact: JSON.parse(campaign?.beneficiary_details)?.contact,
      })
    }
  },[campaign])

  return (
    <>
      <Text pb={4} fontSize={"2xl"} className="serif">
        Create New Campaign
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
            name="category_id"
            placeholder="Select Here"
            onChange={Formik.handleChange}
            value={Formik.values.category_id}
          >
            <option value="1">Medical</option>
            <option value="2">Education</option>
            <option value="3">New Startup</option>
            <option value="4">Sports Help</option>
          </Select>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>How much amount you need?</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"target_amount"}
              onChange={Formik.handleChange}
              value={Formik.values.target_amount}
            />
          </InputGroup>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Duration</FormLabel>
          <RangeDatepicker
            selectedDates={selectedDates}
            onDateChange={setSelectedDates}
          />
        </FormControl>
      </Stack>
      <FormControl py={4}>
        <FormLabel>Enter title for your campaign</FormLabel>
        <Input
          w={"full"}
          variant={"flushed"}
          fontSize={["xl", "2xl", "3xl"]}
          className="serif"
          p={2}
          name="title"
          placeholder="e.g: Help us build a school for underpreviliged children"
          onChange={Formik.handleChange}
          value={Formik.values.title}
        />
      </FormControl>
      <Box p={4}>
        <Text pb={4} fontWeight={"semibold"}>
          Upload Image
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
              {/* <Icon
                  as={BsXCircleFill}
                  color={'red'} pos={'absolute'}
                  size={12} top={0} right={0}
                  onClick={() => removeImage(index)}
              /> */}
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
          value={Formik.values.description}
          placeholder="Brief description of your campaign"
        ></Textarea>
      </FormControl>
      <FormControl py={4}>
        <FormLabel>Your message</FormLabel>
        <Textarea
          w={"full"}
          name="full_description"
          onChange={Formik.handleChange}
          value={Formik.values.full_description}
          placeholder="Tell us about your campaign"
        ></Textarea>
      </FormControl>
      <VStack
        w={"full"}
        py={4}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
      >
        <Text fontSize={"lg"} className="serif">
          Who will benefit from this campaign?
        </Text>
        <FormControl>
          <Stack direction={["column", "row"]} gap={"4"}>
            <Button
              colorScheme="yellow"
              variant={
                beneficiaryDetails.type == "myself" ? "solid" : "outline"
              }
              onClick={() =>
                setBeneficiaryDetails({ ...beneficiaryDetails, type: "myself" })
              }
            >
              Myself
            </Button>
            <Button
              colorScheme="yellow"
              variant={
                beneficiaryDetails.type == "myfamily" ? "solid" : "outline"
              }
              onClick={() =>
                setBeneficiaryDetails({
                  ...beneficiaryDetails,
                  type: "myfamily",
                })
              }
            >
              My Family
            </Button>
            <Button
              colorScheme="yellow"
              variant={
                beneficiaryDetails.type == "individual" ? "solid" : "outline"
              }
              onClick={() =>
                setBeneficiaryDetails({
                  ...beneficiaryDetails,
                  type: "individual",
                })
              }
            >
              Other Individual
            </Button>
            <Button
              colorScheme="yellow"
              variant={beneficiaryDetails.type == "group" ? "solid" : "outline"}
              onClick={() =>
                setBeneficiaryDetails({ ...beneficiaryDetails, type: "group" })
              }
            >
              Group or Community
            </Button>
          </Stack>
        </FormControl>
              <br />
        {beneficiaryDetails.type == "myself" || (
          <VStack
            w={"full"}
            py={4} gap={8}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
          >
            <FormControl w={['full', 'xs']}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter beneficiary name"
                onChange={(e) =>
                  setBeneficiaryDetails({
                    ...beneficiaryDetails,
                    name: e.target.value,
                  })
                }
                value={beneficiaryDetails.name}
              />
            </FormControl>
            <FormControl w={['full', 'xs']}>
              <FormLabel>Contact</FormLabel>
              <Input
                placeholder="Beneficiary contact details"
                onChange={(e) =>
                  setBeneficiaryDetails({
                    ...beneficiaryDetails,
                    contact: e.target.value,
                  })
                }
                value={beneficiaryDetails.contact}
              />
            </FormControl>
            <FormControl w={['full', 'xs']}>
              <FormLabel>Address</FormLabel>
              <Input
                placeholder="Beneficiary address"
                onChange={(e) =>
                  setBeneficiaryDetails({
                    ...beneficiaryDetails,
                    address: e.target.value,
                  })
                }
                value={beneficiaryDetails.address}
              />
            </FormControl>
          </VStack>
        )}
      </VStack>
      <HStack justifyContent={"flex-end"} py={4}>
        <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={Formik.handleSubmit}
        >
          Update Changes
        </Button>
      </HStack>
    </>
  );
};

export default Page;
