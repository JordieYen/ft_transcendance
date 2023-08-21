import router from "next/router";

export const toUserProfile = async (id: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_HOST}/users/${id}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (response.ok) {
      const user = await response.json();
      router.push(`/users/${user.id}`);
    }
  } catch (error) {
    console.log("Error redirect to profile:", error);
  }
};
