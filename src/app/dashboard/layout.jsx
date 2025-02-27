"use client";
import React, { useEffect, useState } from "react";
import {
  Stack,
  Box,
  Text,
  Show,
  VStack,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useDisclosure,
  Hide,
  Spacer,
} from "@chakra-ui/react";
import Link from "next/link";
import { AiFillDashboard, AiFillYoutube } from "react-icons/ai";
import { HiArrowsRightLeft } from "react-icons/hi2";
import {
  BsAlexa,
  BsCalendarCheck,
  BsCartCheckFill,
  BsCashCoin,
  BsClipboardDataFill,
  BsCurrencyRupee,
  BsGearFill,
  BsHeartFill,
  BsMegaphoneFill,
  BsPercent,
  BsPower,
  BsStarFill,
  BsWallet,
  BsYoutube,
} from "react-icons/bs";
import { MdPersonAdd } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { TbBinaryTree } from "react-icons/tb";
import { BiDonateHeart, BiLogIn, BiMenuAltLeft, BiUser } from "react-icons/bi";
import {
  FaMoneyBill,
  FaPercentage,
  FaRegCreditCard,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa";
import BackendAxios from "@/utils/axios";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";

const MenuOptions = () => {
  const [permissions, setPermissions] = useState([]);
  async function handleLogout() {
    await BackendAxios.post("/logout")
      .then(() => {
        Cookies.remove("jwt");
        localStorage.clear();
      })
      .catch((err) => {
        Cookies.remove("jwt");
        localStorage.clear();
      })
      .finally(() => {
        Cookies.remove("jwt");
        localStorage.clear();
      });
    window.location.replace("/");
  }

  useEffect(() => {
    if (
      !localStorage.getItem("permissions") ||
      !JSON.parse(localStorage.getItem("permissions"))?.length
    ) {
      fetchPermissions();
      return;
    }
    setPermissions(JSON.parse(localStorage.getItem("permissions")));
  }, []);

  function fetchPermissions() {
    BackendAxios.get(`/api/admin/user-permissions`)
      .then((res) => {
        const newPermissions = res.data?.map((permission) => permission?.name);
        setPermissions(newPermissions);
        localStorage.setItem("permissions", JSON.stringify(newPermissions));
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          localStorage.clear();
          window.location.assign("/");
        }
      });
  }

  return (
    <>
      <VStack w={"full"} gap={4} pt={8} alignItems={"flex-start"}>
        {/* <Link href={"#"}>
          <HStack gap={4}>
            <BsPersonFill size={20} />
            <Text>Profile</Text>
          </HStack>
        </Link> */}
        <Link href={"/dashboard"}>
          <HStack gap={4}>
            <AiFillDashboard size={20} />
            <Text>Dashboard</Text>
          </HStack>
        </Link>
        <br />

        {permissions.includes("user-view") ? (
          <Link href={"/dashboard/users"}>
            <HStack gap={4}>
              <BiUser size={20} />
              <Text>Manage Users</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("user-view") ? (
          <Link href={"/dashboard/distributors"}>
            <HStack gap={4}>
              <HiUserGroup size={20} />
              <Text>Distributors</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("user-view") ? (
          <Link href={"/dashboard/agents"}>
            <HStack gap={4}>
              <FaUserTie size={20} />
              <Text>Volunteers</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("employees-manage") ? (
          <Link href={"/dashboard/admin"}>
            <HStack gap={4}>
              <FaUserShield size={20} />
              <Text>Admin Employees</Text>
            </HStack>
          </Link>
        ) : null}

        {
          <Link href={"/dashboard/grades"}>
            <HStack gap={4}>
              <BsAlexa size={20} />
              <Text>Grades</Text>
            </HStack>
          </Link>
        }

        <br />
        {permissions.includes("campaign-view") ? (
          <Link href={"/dashboard/campaigns"}>
            <HStack gap={4}>
              <BsMegaphoneFill size={20} />
              <Text>Manage Campaigns</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("donation-view") ? (
          <Link href={"/dashboard/campaign-commission"}>
            <HStack gap={4}>
              <BsPercent size={20} />
              <Text>Campaign Commission</Text>
            </HStack>
          </Link>
        ) : null}
        {permissions.includes("plan-view") ? (
          <Link href={"/dashboard/subscriptions"}>
            <HStack gap={4}>
              <BsCalendarCheck size={20} />
              <Text>Subscriptions</Text>
            </HStack>
          </Link>
        ) : null}
        {permissions.includes("donation-view") ? (
          <Link href={"/dashboard/transactions/group-donations"}>
            <HStack gap={4}>
              <BsCashCoin size={20} />
              <Text>Group Donations</Text>
            </HStack>
          </Link>
        ) : null}
        {permissions.includes("donation-view") ? (
          <Link href={"/dashboard/transactions/senior-junior-donations"}>
            <HStack gap={4}>
              <TbBinaryTree size={20} />
              <Text>Senior-Junior Donations</Text>
            </HStack>
          </Link>
        ) : null}
        {permissions.includes("donation-view") ? (
          <Link href={"/dashboard/all-team-donation"}>
            <HStack gap={4}>
              <BsStarFill size={20} />
              <Text>All Team Donations</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("points-transfers") ? (
          <Link href={"/dashboard/points/transfers"}>
            <HStack gap={4}>
              <HiArrowsRightLeft size={20} />
              <Text>Transfer Requests</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("points-withdrawals") ? (
          <Link href={"/dashboard/points/withdrawals"}>
            <HStack gap={4}>
              <BsHeartFill size={20} />
              <Text>Withdrawals Requests</Text>
            </HStack>
          </Link>
        ) : null}
        <Link href={"/dashboard/cash-points/withdrawals"}>
            <HStack gap={4}>
              <BsCurrencyRupee size={20} />
              <Text>Cash Points Withdrawal</Text>
            </HStack>
          </Link>
        <br />

        {permissions.includes("partner-commission-view") ? (
          <Link href={"/dashboard/commission-distribution"}>
            <HStack gap={4}>
              <FaPercentage size={20} />
              <Text>Commission Data</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("payouts-manage") ? (
          <Link href={"/dashboard/payouts"}>
            <HStack gap={4}>
              <BsWallet size={20} />
              <Text>Payouts</Text>
            </HStack>
          </Link>
        ) : null}

        <br />
        {permissions.includes("donation-view") ? (
          <Link href={"/dashboard/transactions/campaign-donations"}>
            <HStack gap={4}>
              <BiDonateHeart size={20} />
              <Text>Campaign Donations</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("campaign-withdrawals") ? (
          <Link href={"/dashboard/withdrawal-requests"}>
            <HStack gap={4}>
              <FaMoneyBill size={20} />
              <Text>Campaign Withdrawals</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("gateway-transactions-view") ? (
          <Link href={"/dashboard/transactions/gateway-transactions"}>
            <HStack gap={4}>
              <BsClipboardDataFill size={20} />
              <Text>Gateway Transactions</Text>
            </HStack>
          </Link>
        ) : null}

        {permissions.includes("gift-cards-manage") ? (
          <Link href={"/dashboard/gift-cards"}>
            <HStack gap={4}>
              <FaRegCreditCard size={20} />
              <Text>Gift Cards</Text>
            </HStack>
          </Link>
        ) : null}

        <Link href={"/dashboard/invitations"}>
          <HStack gap={4}>
            <MdPersonAdd size={20} />
            <Text>Invitations</Text>
          </HStack>
        </Link>

        <br />

        {permissions.includes("videos-manage") ? (
          <Accordion allowToggle w={"full"}>
            <AccordionItem w={"full"}>
              <AccordionButton w={"full"} px={0}>
                <HStack w={"full"}>
                  <BsYoutube size={20} />
                  <Text>Videos</Text>
                  <Spacer />
                  <AccordionIcon />
                </HStack>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack
                  alignItems={"flex-start"}
                  justifyContent={"center"}
                  gap={6}
                  w={"full"}
                >
                  <Link href={"/dashboard/videos"}>
                    <HStack gap={4}>
                      <Text>All Videos</Text>
                    </HStack>
                  </Link>

                  <Link href={"/dashboard/videos/video-views"}>
                    <HStack gap={4}>
                      <Text>Video Views</Text>
                    </HStack>
                  </Link>

                  <Link href={"/dashboard/videos/user-views"}>
                    <HStack gap={4}>
                      <Text>Users Data</Text>
                    </HStack>
                  </Link>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ) : null}

        {permissions.includes("ecommerce-manage") ? (
          <Accordion allowToggle w={"full"}>
            <AccordionItem w={"full"}>
              <AccordionButton w={"full"} px={0}>
                <HStack w={"full"}>
                  <BsCartCheckFill size={20} />
                  <Text>Ecommerce</Text>
                  <Spacer />
                  <AccordionIcon />
                </HStack>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack
                  alignItems={"flex-start"}
                  justifyContent={"center"}
                  gap={6}
                  w={"full"}
                  py={4}
                >
                  <Link href={"/dashboard/ecommerce/categories"}>
                    <HStack gap={4}>
                      <Text>Categories</Text>
                    </HStack>
                  </Link>

                  <Link href={"/dashboard/ecommerce/products"}>
                    <HStack gap={4}>
                      <Text>Products</Text>
                    </HStack>
                  </Link>

                  <Link href={"/dashboard/ecommerce/orders"}>
                    <HStack gap={4}>
                      <Text>Orders</Text>
                    </HStack>
                  </Link>

                  <Link href={"/dashboard/ecommerce/gift-cards"}>
                    <HStack gap={4}>
                      <Text>Discount Code</Text>
                    </HStack>
                  </Link>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ) : null}

        <Link href={"/dashboard/logins"}>
          <HStack gap={4}>
            <BiLogIn size={20} />
            <Text>Login Report</Text>
          </HStack>
        </Link>

        {permissions.includes("website-controls") ? (
          <Link href={"/dashboard/controls"}>
            <HStack gap={4}>
              <BsGearFill size={20} />
              <Text>Website Controls</Text>
            </HStack>
          </Link>
        ) : null}

        <br />
        {/* <Link href={"/dashboard"}>
                <HStack gap={4}>
                  <BsHeartFill size={20} />
                  <Text>Support Tickets</Text>
                </HStack>
              </Link> */}
        <HStack gap={4} cursor={"pointer"} onClick={handleLogout}>
          <BsPower size={20} />
          <Text>Log Out</Text>
        </HStack>
      </VStack>
    </>
  );
};

const Layout = ({ children }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Hide above="md">
        <HStack p={4} spacing={4}>
          <BiMenuAltLeft size={28} onClick={onToggle} />
          <Text fontSize={"lg"}>Virolife Admin</Text>
        </HStack>
      </Hide>

      <Stack direction={"row"} justifyContent={"space-between"}>
        <Show above="md">
          <Box
            p={8}
            bg={"blanchedalmond"}
            w={"xs"}
            h={"100vh"}
            overflow={"scroll"}
          >
            <Text className="serif" fontSize={"xl"} fontWeight={"semibold"}>
              Virolife
            </Text>
            <MenuOptions />
          </Box>
        </Show>
        <Box p={[4, 8, 8]} w={"full"} height={"100vh"} overflowY={"scroll"}>
          {children}
        </Box>
      </Stack>

      <Drawer size={"xs"} isOpen={isOpen} onClose={onToggle} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Virolife Admin</DrawerHeader>
          <DrawerBody>
            <MenuOptions />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Layout;
