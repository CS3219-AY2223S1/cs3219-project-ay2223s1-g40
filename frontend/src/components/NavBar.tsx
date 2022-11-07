import { ReactNode } from "react";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import useUserStore from "../store/userStore";

const NavLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <Link
    padding={2}
    rounded={"md"}
    as={RouterLink}
    to={to}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
  >
    {children}
  </Link>
);

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const zustandLogout = useUserStore((state) => state.logout);
  const zustandUsername = useUserStore((state) => state.username);

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <NavLink to={"/difficulty"}>PeerPrep</NavLink>
        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={"https://avatars.dicebear.com/api/male/username.svg"}
                />
              </MenuButton>
              <MenuList alignItems={"center"}>
                <Center>
                  <p>{zustandUsername}</p>
                </Center>
                <MenuDivider />
                <MenuItem
                  onClick={() => navigate("/profile", { replace: true })}
                >
                  Account Settings
                </MenuItem>
                <MenuItem onClick={() => zustandLogout()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
