import MenuClient from "./Components/MenuClient";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MenuPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialSlug = typeof params.slug === "string" ? params.slug : "";

  return <MenuClient initialSlug={initialSlug} />;
}
