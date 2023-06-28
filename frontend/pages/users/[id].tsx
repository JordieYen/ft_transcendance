import PongMain from "@/app/component/profile/PongMain";
import { useRouter } from "next/router";

const UserProfilePage = () => {
    const router = useRouter();
    const { id } = router.query;
    console.log('id', id);
    
    return (
       <PongMain userId={id} />
    );
};

export default UserProfilePage;
