// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx


"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Card } from "antd";
import "@ant-design/v5-patch-for-react-19"; //!put into every page for react19 to work
import React, { useEffect, useState } from "react";
// Optionally, you can import a CSS module or file for additional styling:
//import styles from "@/styles/page.module.css";

/*
interface FormFieldProps {
  label: string;
  value: string;
}


async function fetchData(id:string) {
    const response = await fetch(`/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
    return await response.json();
  }
*/

const Profile: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const { value: token } = useLocalStorage<string>("token", "");

  useEffect(() => {
    //TODO: If necessary check for token to initiate a redirect

    const fetchUser = async () => {
      try{
        const userid = params.id as string;
        const user: User = await apiService.get<User>(`/users/${userid}`);
        setUser(user);
      } catch {
        //console.error("Faild to fetch userdata:", error);
        router.push("/users")
      }
    };

    fetchUser();
  }, [params.id, apiService, token, router]);

  if (!user) return <div>User not found</div>;

  return (
    <div className="login-container">
      <Form>
        <Card title = "User Profile">
          <p><strong>Username: </strong> {user.username}</p>
          <p><strong>Birthdate: </strong> {user.birthDate}</p>
          <p><strong>Status: </strong> {user.status}</p>
          <p><strong>Account creation date: </strong> {user.creationDate}</p>
        </Card>

        <Button type="default" htmlType="button" className="userdata-form" onClick={() => router.push(`/users/${user.id}/edit`)}>
          edit
        </Button>
        <Button type="default" htmlType="button" className="userdata-form" onClick={() => router.push(`/users/`)}>
          back
        </Button>
      </Form>
    </div>
  );
};

export default Profile;