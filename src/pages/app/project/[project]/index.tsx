import { CardanoWallet, useWallet } from "@meshsdk/react";
import { BadgeCheck, BadgeX } from "lucide-react";
import { useRouter } from "next/router";
import MintProjectStateDialog from "~/components/cardano/tx/contributor/mint-project-state/MintProjectStateDialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import AccessTokenComponent from "~/ui/dashboard/components/AccessTokenComponent";

export default function ProjectPage() {
  const router = useRouter();
  const { project } = router.query;
  const { connected } = useWallet();
  const { accessTokenAlias } = useAccessToken();
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Project 1</h1>
        <p className="text-gray-600">
          Explore the in-depth information and curriculum of "Project 1".
        </p>
      </div>

      {/* Image & Description */}
      <div className="mb-8 flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        <img
          src="https://via.placeholder.com/400x300"
          alt="Project 1"
          className="max-w-sm rounded-lg shadow-md"
        />
        <div>
          <h2 className="mb-2 text-2xl font-semibold">About the Project</h2>
          <p className="text-gray-600">
            Project 1 is a comprehensive guide to learning advanced techniques
            in [topic]. It’s designed to help you master key concepts, improve
            your skills, and achieve your goals.
          </p>
        </div>
      </div>

      {/* Curriculum Section */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">What You Will Learn</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-600">
          <li>Introduction to the fundamentals</li>
          <li>Intermediate concepts and hands-on projects</li>
          <li>Advanced topics to enhance your understanding</li>
          <li>Final project to showcase your skills</li>
        </ul>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
              Join Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="grid gap-4 py-4">
              <div className="flex gap-x-4">
                {connected ? <BadgeCheck /> : <BadgeX />}
                Connected to Cardano
                {!connected && <CardanoWallet />}
              </div>
              <div className="flex gap-x-4">
                {accessTokenAlias ? <BadgeCheck /> : <BadgeX />}
                Connected to Andamio Network
                {connected && !accessTokenAlias && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        Join Andamio Network
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <AccessTokenComponent />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <DialogFooter>

              <Dialog>
                <DialogTrigger asChild>
                  <Button type="submit" disabled={!connected || !accessTokenAlias}>Proceed To Join</Button>
                </DialogTrigger>
                <DialogContent>
                  {/* TO-DO */}
                  <MintProjectStateDialog />
                </DialogContent>
              </Dialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
