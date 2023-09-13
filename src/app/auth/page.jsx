"use client";
import BackendAxios, { FormAxios } from "@/utils/axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { isExpired } from "react-jwt";

const Auth = () => {
  const Toast = useToast({ position: "top-right" });
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies, setCookie] = useCookies(["jwt"]);
  const [showPassword, setShowPassword] = useState(false)

  const Formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isExpired(Cookies.get("jwt"))) {
      router.push("/dashboard");
    }
  }, []);

  function handleLogin() {
    if (!Formik.values.email || !Formik.values.password) {
      Toast({
        description: "Email and password must not be empty",
      });
      return;
    }
    BackendAxios.post("/admin/login", { ...Formik.values })
      .then((res) => {
        Toast({
          status: "success",
          description: "Login successful!",
        });
        BackendAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data?.access_token}`;
        FormAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data?.access_token}`;
        Cookies.set("jwt", res.data?.access_token)
        router.push("/dashboard");
        // setCookie("jwt", res.data?.access_token);
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
      <VStack w={"full"} h={"100vh"} gap={16} justifyContent={"center"}>
        <Image src="/logo.png" w={28} />
        <Box
          bgColor={"yellow.50"}
          rounded={12}
          border={"1px"}
          borderColor={"yellow.600"}
          p={8}
          w={["full", "sm"]}
        >
          <FormControl mb={8}>
            <FormLabel>Email</FormLabel>
            <Input
              variant={"flushed"}
              onChange={Formik.handleChange}
              name="email"
            />
          </FormControl>
          <FormControl mb={8}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                variant={"flushed"}
                type={showPassword ? "text" : "password"}
                onChange={Formik.handleChange}
                name="password"
              />
              <InputRightElement 
              children={showPassword ? <BsEyeSlash /> : <BsEye />} 
              onClick={()=>setShowPassword(!showPassword)}
              cursor={'pointer'}
              />
            </InputGroup>
          </FormControl>
          <HStack w={"full"} gap={8} justifyContent={"flex-end"}>
            <Button size={"xs"} variant={"unstyled"}>
              Forgot Password?
            </Button>
            <Button colorScheme="yellow" onClick={handleLogin}>
              Login
            </Button>
          </HStack>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter OTP</ModalHeader>
          <ModalBody>
            <HStack justifyContent={"center"} gap={6} w={"full"}>
              <PinInput otp>
                <PinInputField bg={"blanchedalmond"} />
                <PinInputField bg={"blanchedalmond"} />
                <PinInputField bg={"blanchedalmond"} />
                <PinInputField bg={"blanchedalmond"} />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"} gap={8}>
              <Button colorScheme="yellow" variant={"outline"}>
                Resend OTP
              </Button>
              <Button colorScheme="yellow" onClick={handleLogin}>
                Login
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Auth;
