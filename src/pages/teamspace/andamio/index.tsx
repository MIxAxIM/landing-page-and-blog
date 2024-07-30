import { CardanoWallet } from "@meshsdk/react";
import MenuBar from "../../../ui/landing/MenuBar";
import Footer from "../../../ui/landing/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Link from "next/link";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function TeamPage() {
  const ctx = api.useUtils();
  const router = useRouter();

  const { data: sessionData } = useSession();

  const { mutate: updateSessionRole } =
    api.role.updateSessionRole.useMutation({
      onSuccess: () => {
        toast.success("Unconfirmed Tx updated");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        console.error(errorMessage);
        toast.error("Something went wrong. Please try again.");
      },
    });

    const handleClick = async (event: { preventDefault: () => void; }) => {
      event.preventDefault(); // Prevent the default link behavior
  
      // Perform your task here
      await selectSessionRole();
  
      // Navigate to the new link
      router.push('/teamspace/andamio/admin');
    };
  
    const selectSessionRole = async () => {
      updateSessionRole({
        accessToken: "example",
        team: "example",
        role: "example",
        sessionId: sessionData!.sessionId
      })
    };

  return (
    <div>
      <MenuBar />

      <main className="px-10 py-24">
        <div className="flex justify-center">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Andamio Team
          </h2>
        </div>
        <div className="flex max-w-full flex-col items-center justify-center">
          <Card className="my-20 w-2/3">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Connect wallet for Andamio to find assets belonging to your
                organizations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardanoWallet />
            </CardContent>
          </Card>
          <div>
            <Tabs defaultValue="admin" className="w-[600px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="reviewer">Reviewer</TabsTrigger>
                <TabsTrigger value="contributor">Contributor</TabsTrigger>
              </TabsList>
              <TabsContent value="admin">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin</CardTitle>
                    <CardDescription>Select your admin token.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </CardContent>
                  <CardFooter>
                  <Button onClick={handleClick}>Admin Dashboard</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="reviewer">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviewer</CardTitle>
                    <CardDescription>
                      Select your reviewer token.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </CardContent>
                  <CardFooter>
                  <Link href={"/teamspace/andamio/reviewer"}><Button>Reviewer Dashboard</Button></Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="contributor">
                <Card>
                  <CardHeader>
                    <CardTitle>Contributor</CardTitle>
                    <CardDescription>
                      Select your contributor token.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </CardContent>
                  <CardFooter>
                    <Link href={"/teamspace/andamio/contributor"}><Button>Contributor Dashboard</Button></Link>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
