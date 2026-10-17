import type { GetServerSideProps } from "next";

export const policyPageProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  return {
    props: {
      initialEdition:
        req.cookies["tb-edition"] === "Australia" ? "Australia" : "Nigeria",
    },
  };
};
