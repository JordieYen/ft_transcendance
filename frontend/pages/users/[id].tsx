import { useRouter } from "next/router";

const UserPage = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div>
            <h1>User ID: {id}</h1>
        </div>
    );
};

export default UserPage;
