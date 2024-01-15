import React, { useCallback, useState } from 'react'
import {
    Flex,
    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    Switch,
    useColorMode,
    useColorModeValue,
    useToast,
    Link as ChakraLink
} from '@chakra-ui/react';
import { redirect } from "react-router-dom";
import { Link as ReactRouterLink } from 'react-router-dom'
import axios from "axios";
import { useAuthStore } from '@/store/authStore';
import { APPLICATION_CONFIG } from '@/configs';


// TODO REFACTOR. ITS VERY BAD CODE


function LoginScreen() {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const { toggleColorMode } = useColorMode();
    const toast = useToast();
    const formBackground = useColorModeValue('gray.100', 'gray.700');

    const handleLogin =  useCallback(async() => {

        if(password !== repeatPassword){
            toast({
                title: 'Invalid Data',
                description: "Password are not equal",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        if(userName === "" || password === ""){
            toast({
                title: 'Enter password and User name.',
                description: "Please input all data",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        try {
            const req = await axios.post(APPLICATION_CONFIG.SERVER_ADDRESS + "/auth/register", { userName, password });

            console.log(req.status);
    
            if(req.status === 200){
                toast({
                    title: 'Success!',
                    description: "User account create success",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })

                redirect("/");
            }

        } catch (error: any) {
            
            let messeage = {
                "VALIDATION_ERROR": "User name must contain min 5 chars and password 8",
                "USER_EXIST": "User name have been already taken"
            }

            toast({
                title: "Server error.",
                //@ts-ignore
                description: messeage[error?.response?.data?.code],
                status: "error",
                duration: 3000
            })
        }

    },[userName, password, repeatPassword]);


    return (
        <Flex h="100vh" alignItems="center" justifyContent="center">
            <Flex
                flexDirection="column"
                bg={formBackground}
                p={12}
                borderRadius={8}
                boxShadow="lg"
            >
                <Heading mb={6}>Register now!</Heading>
                <Input
                    placeholder="johndoe@gmail.com"
                    type="email"
                    variant="filled"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    mb={3}
                />
                <Input
                    placeholder="**********"
                    type="password"
                    variant="filled"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    mb={3}
                />
                <Input
                    placeholder="**********"
                    type="password"
                    variant="filled"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    mb={6}
                />
                <Button colorScheme="teal" mb={8} onClick={handleLogin}>
                    Log In
                </Button>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dark_mode" mb="4">
                        Have a account? <ChakraLink as={ReactRouterLink} to={'/'}> Login now! </ChakraLink>
                    </FormLabel>
                </FormControl>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dark_mode" mb="0">
                        Enable Dark Mode?
                    </FormLabel>
                    <Switch
                        id="dark_mode"
                        colorScheme="teal"
                        size="lg"
                        onChange={toggleColorMode}
                    />
                </FormControl>
            </Flex>
        </Flex>
    )
}

export default LoginScreen;