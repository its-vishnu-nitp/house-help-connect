import { useEffect } from "react";
import api from "../services/api";

const Profile = () => {
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/user/profile");
      console.log(res.data);
    };
    fetchProfile();
  }, []);

  return <h2>Profile Page</h2>;
};

export default Profile;
